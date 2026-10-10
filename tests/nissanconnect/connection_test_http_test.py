"""Loopback-only PHP endpoint checks with an isolated synthetic Python worker."""
import concurrent.futures
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import time
from urllib.error import HTTPError
from urllib.request import build_opener, HTTPRedirectHandler, ProxyHandler, Request
import uuid

import pytest


PHP = os.environ.get('NISSAN_TEST_PHP') or shutil.which('php')


@pytest.mark.skipif(not PHP or sys.platform != 'linux',
                    reason='PHP on Linux is needed for endpoint ownership and loopback checks')
def test_complete_php_http_contract_with_synthetic_worker(tmp_path):
    # The child does not inherit pytest's network hooks. It explicitly permits
    # only loopback HTTP and starts no Nissan client or openWB service.
    result = subprocess.run([sys.executable, '-I', '-B', __file__, '--synthetic-http', str(PHP),
                             str(tmp_path / 'http')], capture_output=True, text=True, timeout=60)
    assert result.returncode == 0, result.stdout + result.stderr
    report = json.loads(result.stdout)
    assert len(report['checks']) >= 20


def _php_string(value):
    return "'" + str(value).replace('\\', '\\\\').replace("'", "\\'") + "'"


class _NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        raise AssertionError('Redirects are forbidden in loopback tests')


def _run_http_checks(php, root):
    root.mkdir(parents=True, exist_ok=False)
    document = root / 'www'
    app = document / 'openWB'
    web = app / 'web/settings/modules/vehicles/nissanconnect'
    web.mkdir(parents=True)
    cache = root / 'temp'
    cache.mkdir()
    source = Path(__file__).resolve().parents[2] / 'public/modules/vehicles/nissanconnect'
    endpoint = (source / 'test_connection.php').read_text(encoding='utf-8')
    interpreter_constant = 'const NISSAN_TEST_PYTHON_EXECUTABLE = "/usr/bin/python3";'
    assert endpoint.count(interpreter_constant) == 1
    # Only the interpreter constant changes in this endpoint copy; the fixed
    # worker location below contains a fixture instead of the real API client.
    endpoint = endpoint.replace(
        interpreter_constant, 'const NISSAN_TEST_PYTHON_EXECUTABLE = ' + _php_string(sys.executable) + ';')
    (web / 'test_connection.php').write_bytes(endpoint.encode('utf-8'))
    shutil.copyfile(source / 'connection_test_lib.php', web / 'connection_test_lib.php')
    worker = app / 'packages/modules/vehicles/nissanconnect/connection_test.py'
    worker.parent.mkdir(parents=True)
    worker.write_text('''import json, sys, time
from pathlib import Path
p = json.load(sys.stdin)
assert p['user_id'].endswith('@example.invalid')
with Path(__file__).with_name('calls').open('a', encoding='ascii') as f:
    f.write('started\\n')
mode = p['password']
if mode == 'fixture-slow':
    time.sleep(1.5)
if mode == 'fixture-invalid-output':
    print('synthetic-private-invalid-output')
    print('synthetic-private-stderr', file=sys.stderr)
    raise SystemExit(0)
if mode in ('fixture-auth', 'fixture-battery-error', 'fixture-provider'):
    code = {'fixture-auth': 'authentication_failed', 'fixture-battery-error': 'query_failed',
            'fixture-provider': 'rate_limited'}[mode]
    result = {'success': False, 'code': code, 'query': {'retry_after_seconds': 300,
              'provider_retry_after_seconds': 900 if mode == 'fixture-provider' else 0}}
else:
    assert mode in ('fixture-ok', 'fixture-slow')
    result = {'success': True, 'code': 'success', 'query': {'outcome': 'success', 'soc': 0, 'range_km': None,
              'request_started_at': '2022-01-02T00:00:00Z', 'completed_at': '2022-01-02T00:00:01Z',
              'measurement_at': '2022-01-01T00:00:00Z'}}
print(json.dumps(result))
''', encoding='utf-8')
    marker = uuid.uuid4().hex
    (document / 'health.php').write_text(
        '<?php echo json_encode([' + _php_string(marker) + ', sys_get_temp_dir() === ' +
        _php_string(str(cache)) + ']);', encoding='utf-8')
    opener = build_opener(ProxyHandler({}), _NoRedirect())
    processes = []
    origins = []
    checks = []

    def check(name, condition):
        assert condition, name
        checks.append(name)

    def request(index=0, user='a', password='fixture-ok', method='POST', headers=None, raw=None, vin=None):
        origin = origins[index]
        assert origin.startswith('http://127.0.0.1:')
        fields = {'Content-Type': 'application/json', 'Origin': origin, 'Sec-Fetch-Site': 'same-origin'}
        fields.update(headers or {})
        fields = {k: v for k, v in fields.items() if v is not None}
        payload = json.dumps({'user_id': user + '@example.invalid', 'password': password, 'vin': vin}).encode()
        req = Request(origin + '/openWB/web/settings/modules/vehicles/nissanconnect/test_connection.php',
                      data=(raw if raw is not None else payload) if method == 'POST' else None,
                      headers=fields, method=method)
        try:
            response = opener.open(req, timeout=8)
        except HTTPError as error:
            response = error
        with response:
            body = response.read().decode('utf-8')
            assert 'synthetic-private' not in body
            assert response.headers.get('Cache-Control') == 'no-store'
            assert response.headers.get('X-Content-Type-Options') == 'nosniff'
            return response.status, json.loads(body), response.headers

    def calls():
        path = worker.with_name('calls')
        return len(path.read_text(encoding='ascii').splitlines()) if path.exists() else 0

    try:
        for _ in range(2):
            with socket.socket() as probe:
                probe.bind(('127.0.0.1', 0))
                port = probe.getsockname()[1]
            origin = 'http://127.0.0.1:' + str(port)
            process = subprocess.Popen([php, '-n', '-d', 'sys_temp_dir=' + str(cache), '-S',
                                        '127.0.0.1:' + str(port), '-t', str(document)],
                                       stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                                       stderr=subprocess.DEVNULL,
                                       creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
            processes.append(process)
            origins.append(origin)
            deadline = time.monotonic() + 8
            while True:
                assert process.poll() is None, 'Owned PHP server exited'
                try:
                    with opener.open(origin + '/health.php', timeout=1) as response:
                        ready = json.loads(response.read())
                    assert ready == [marker, True], 'Unexpected server or temporary directory'
                    break
                except OSError:
                    if time.monotonic() >= deadline:
                        raise
                    time.sleep(0.05)

        status, _, headers = request(method='GET')
        check('GET rejected without worker', status == 405 and headers['Allow'] == 'POST')
        for name, headers in (
                ('missing origin', {'Origin': None}),
                ('foreign origin', {'Origin': 'https://foreign.example.invalid'}),
                ('wrong content type', {'Content-Type': 'application/x-www-form-urlencoded'}),
                ('cross-site request', {'Sec-Fetch-Site': 'cross-site'})):
            check(name, request(headers=headers)[0] == 403)
        for name, raw in (('invalid JSON', b'{'), ('oversized input', b'x' * 8193),
                          ('invalid fields', b'{"user_id":"a"}')):
            check(name, request(raw=raw)[0] == 400)
        check('guards started no workers', calls() == 0)
        status, body, _ = request(password='fixture-auth')
        check('failed login has no cooldown', status == 200 and body['code'] == 'authentication_failed'
              and body['retry_after_seconds'] == 0)
        status, body, _ = request()
        check('corrected login accepts zero SoC', status == 200 and body['success'] and body['query']['soc'] == 0
              and body['account_retry_after_seconds'] == 300)
        count = calls()
        status, body, headers = request(password='fixture-auth', vin='SJNFAAZE1U0000002')
        check('same account keeps cooldown after password/VIN change', status == 429 and body['code'] == 'cooldown'
              and 0 < int(headers['Retry-After']) <= 300 and calls() == count)
        check('another account succeeds immediately', request(user='b')[1]['success'])
        check('returning to first account stays blocked', request()[0] == 429)
        status, body, _ = request(user='c', password='fixture-battery-error')
        check('battery error adds no local cooldown', status == 200 and body['code'] == 'query_failed'
              and body['retry_after_seconds'] == 0)
        check('battery error permits immediate retry', request(user='c')[1]['success'])
        status, body, _ = request(user='d', password='fixture-invalid-output')
        check('invalid worker output stays private', status == 200 and body['code'] == 'unavailable'
              and body['retry_after_seconds'] == 0)
        check('invalid output permits retry', request(user='d')[1]['success'])
        count = calls()
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            running = executor.submit(request, user='e', password='fixture-slow')
            deadline = time.monotonic() + 5
            while calls() == count and time.monotonic() < deadline:
                time.sleep(0.02)
            assert calls() == count + 1
            status, body, _ = request(index=1, user='f')
            check('concurrent server reports busy without delay', status == 429 and body['code'] == 'busy'
                  and body['retry_after_seconds'] == 0)
            check('first concurrent query completes', running.result()[1]['success'])
        check('busy caller may retry immediately', request(index=1, user='f')[1]['success'])
        status, body, _ = request(user='provider', password='fixture-provider')
        check('provider advice is separate', status == 200 and body['account_retry_after_seconds'] == 0
              and body['provider_retry_after_seconds'] == 900)
        count = calls()
        status, body, _ = request(index=1, user='new')
        check('provider delay spans accounts and servers', status == 429 and body['code'] == 'provider_delay'
              and 0 < body['provider_retry_after_seconds'] <= 900 and calls() == count)
        state_path = cache / 'openwb-nissanconnect-test/state'
        raw = state_path.read_text(encoding='utf-8')
        check('state excludes account identifiers and vehicle data', all(
            value not in raw for value in ('@example.invalid', 'fixture-', 'soc', 'measurement_at', 'range_km')))
        state = json.loads(raw)
        # Advance only this fixture's stored expiry values; no real timer/state is touched.
        state['accounts'] = {key: 1 for key in state['accounts']}
        state['provider_until'] = 0
        state_path.write_text(json.dumps(state), encoding='utf-8')
        check('expired fixture state permits a new test', request()[1]['success'])
        return {'checks': checks}
    finally:
        for process in processes:
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=3)


if __name__ == '__main__':
    assert len(sys.argv) == 4 and sys.argv[1] == '--synthetic-http'
    print(json.dumps(_run_http_checks(sys.argv[2], Path(sys.argv[3]))))
