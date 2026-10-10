"""Optional PHP endpoint checks; synthetic stdin only, never a network query."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

import pytest


PHP = os.environ.get('NISSAN_TEST_PHP') or shutil.which('php')
LIBRARY = Path(__file__).resolve().parents[2] / 'public/modules/vehicles/nissanconnect/connection_test_lib.php'
pytestmark = pytest.mark.skipif(not PHP, reason='PHP CLI is needed for module endpoint checks')


def php(code, *args):
    result = subprocess.run([PHP, '-n', '-r', 'require $argv[1]; ' + code, str(LIBRARY), *args],
                            capture_output=True, text=True, timeout=10, check=True)
    assert result.stderr == ''
    return json.loads(result.stdout)


@pytest.mark.parametrize('origin,host,https,expected', [
    ('http://wallbox.example.invalid', 'wallbox.example.invalid', '', True),
    ('https://wallbox.example.invalid:444', 'wallbox.example.invalid:444', 'on', True),
    ('https://wallbox.example.invalid', 'wallbox.example.invalid', '', False),
    ('http://other.example.invalid', 'wallbox.example.invalid', '', False),
    ('http://wallbox.example.invalid:81', 'wallbox.example.invalid', '', False),
    ('null', 'wallbox.example.invalid', '', False),
    ('http://user@wallbox.example.invalid', 'wallbox.example.invalid', '', False),
    ('http://wallbox.example.invalid/path', 'wallbox.example.invalid', '', False),
])
def test_php_requires_same_origin(origin, host, https, expected):
    server = {'HTTP_ORIGIN': origin, 'HTTP_HOST': host, 'HTTPS': https}
    assert php('echo json_encode(nissan_test_valid_origin(json_decode($argv[2], true)));',
               json.dumps(server)) is expected


@pytest.mark.parametrize('payload,expected', [
    ({'user_id': 'synthetic@example.invalid', 'password': 'synthetic-password', 'vin': None}, True),
    ({'user_id': 'a', 'password': 'p', 'vin': 'SJNFAAZE1U0000001'}, True),
    ({'user_id': 'a', 'password': 'p', 'vin': []}, False),
    ({'user_id': 'a', 'password': 'p', 'url': 'https://other.example.invalid'}, False),
    ({'user_id': '', 'password': 'p'}, False),
])
def test_php_validates_before_running_worker(payload, expected):
    assert php('echo json_encode(nissan_test_valid_input(json_decode($argv[2], true)));',
               json.dumps(payload)) is expected


def test_php_passes_input_on_stdin_and_discards_stderr():
    worker = ('import json,sys; p=json.load(sys.stdin); assert len(sys.argv)==1; '
              'assert p["password"]=="synthetic-password"; '
              'print("synthetic-private-error",file=sys.stderr); '
              'print(json.dumps({"success": True, "code": "success"}))')
    result = php('echo json_encode(nissan_test_run_worker(json_decode($argv[2], true), $argv[3]));',
                 json.dumps([sys.executable, '-I', '-B', '-c', worker]),
                 json.dumps({'password': 'synthetic-password'}))
    assert result == {'success': True, 'code': 'success'}


@pytest.mark.parametrize('worker,timeout,expected', [
    ('print("synthetic-private-invalid-output")', 2, 'unavailable'),
    ('print("x" * 9000)', 2, 'timeout'),
    ('import time; time.sleep(0.2)', 0.01, 'timeout'),
])
def test_php_rejects_invalid_oversized_or_late_worker_output(worker, timeout, expected):
    result = php('echo json_encode(nissan_test_run_worker(json_decode($argv[2], true), "{}", (float)$argv[3]));',
                 json.dumps([sys.executable, '-I', '-B', '-c', worker]), str(timeout))
    assert result == {'success': False, 'code': expected}


def test_php_success_cooldown_is_private_account_scoped_and_expires():
    success = {'success': True, 'code': 'success', 'query': {
        'outcome': 'success', 'soc': 0, 'range_km': None,
        'request_started_at': '2022-01-01T00:00:00Z', 'completed_at': '2022-01-01T00:00:01Z',
        'measurement_at': '2022-01-01T00:00:00Z'}}
    result = php('$file = tmpfile(); $state = nissan_test_load_state($file, 1000); '
                 '$a = nissan_test_account_key($state, "Synthetic-A@example.invalid"); '
                 '$b = nissan_test_account_key($state, "synthetic-b@example.invalid"); '
                 'nissan_test_record_result($state, $a, json_decode($argv[2], true), 1000); '
                 '$ok = nissan_test_store_state($file, $state); rewind($file); '
                 '$raw = stream_get_contents($file); $state = nissan_test_load_state($file, 1010); '
                 'echo json_encode([$ok, $raw, nissan_test_delays($state, $a, 1010), '
                 'nissan_test_delays($state, $b, 1010), nissan_test_delays($state, $a, 1300), '
                 'nissan_test_account_key($state, " synthetic-a@example.invalid ") === $a]); fclose($file);',
                 json.dumps(success))
    assert result[0] is True and result[5] is True
    assert 'synthetic' not in result[1].lower() and 'soc' not in result[1]
    assert result[2]['account_retry_after_seconds'] == 290
    assert result[3]['retry_after_seconds'] == result[4]['retry_after_seconds'] == 0


@pytest.mark.parametrize('code,provider_delay,expected', [
    ('authentication_failed', 0, 0), ('query_failed', 0, 0), ('busy', 0, 0), ('rate_limited', 600, 600)])
def test_php_failures_only_retain_provider_delays_across_accounts(code, provider_delay, expected):
    result = {'success': False, 'code': code,
              'query': {'retry_after_seconds': 300, 'provider_retry_after_seconds': provider_delay}}
    delays = php('$file = tmpfile(); $state = nissan_test_load_state($file, 1000); '
                 '$a = nissan_test_account_key($state, "a"); $b = nissan_test_account_key($state, "b"); '
                 'nissan_test_record_result($state, $a, json_decode($argv[2], true), 1000); '
                 'echo json_encode([nissan_test_delays($state, $a, 1000), '
                 'nissan_test_delays($state, $b, 1000)]); fclose($file);', json.dumps(result))
    assert all(item['account_retry_after_seconds'] == 0 for item in delays)
    assert all(item['retry_after_seconds'] == expected for item in delays)


def test_php_partial_success_does_not_start_cooldown():
    result = php('$file = tmpfile(); $state = nissan_test_load_state($file, 1000); '
                 '$a = nissan_test_account_key($state, "a"); '
                 '$result = nissan_test_record_result($state, $a, ["success" => true], 1000); '
                 'echo json_encode([$result, nissan_test_delays($state, $a, 1000)]); fclose($file);')
    assert result[0]['success'] is False and result[1]['retry_after_seconds'] == 0


def test_php_refuses_state_when_file_is_not_writable(tmp_path):
    path = tmp_path / 'synthetic-state'
    path.write_text('unchanged', encoding='ascii')
    assert php('$file = fopen($argv[2], "r"); '
               'echo json_encode(@nissan_test_store_state($file, [])); fclose($file);', str(path)) is False
    assert path.read_text(encoding='ascii') == 'unchanged'


def test_php_global_lock_rejects_a_concurrent_handle_without_delay(tmp_path):
    path = tmp_path / 'synthetic-lock'
    assert php('$a = fopen($argv[2], "c+"); $b = fopen($argv[2], "c+"); '
               '$first = flock($a, LOCK_EX | LOCK_NB); $second = flock($b, LOCK_EX | LOCK_NB); '
               'flock($a, LOCK_UN); $after = flock($b, LOCK_EX | LOCK_NB); '
               'echo json_encode([$first, $second, $after]); fclose($a); fclose($b);', str(path)) == [True, False, True]


@pytest.mark.parametrize('value,success', [
    (0, True), (12345.6, True), (None, True), (-1, False), ('12345', False), (True, False)])
def test_php_optional_odometer_validation(value, success):
    result = {'success': True, 'code': 'success', 'query': {
        'outcome': 'success', 'soc': 47, 'range_km': None, 'odometer_km': value,
        'request_started_at': '2022-01-01T00:00:00Z', 'completed_at': '2022-01-01T00:00:01Z',
        'measurement_at': '2022-01-01T00:00:00Z', 'provider_retry_after_seconds': 900}}
    returned = php('$file = tmpfile(); $state = nissan_test_load_state($file, 1000); '
                   '$result = nissan_test_record_result($state, "synthetic", json_decode($argv[2], true), 1000); '
                   'echo json_encode([$result, $state]); fclose($file);', json.dumps(result))
    assert returned[0]['success'] is success
    if success:
        assert returned[0]['query']['odometer_km'] == value
        assert returned[1]['provider_until'] == 1900
        assert 'odometer' not in json.dumps(returned[1])
