"""Private-state checks use disposable fixtures, never a real account or wallbox."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

import pytest


PHP = os.environ.get("NISSAN_TEST_PHP") or shutil.which("php")
LIBRARY = Path(__file__).resolve().parents[2] / "public/modules/vehicles/nissanconnect/connection_test_lib.php"
pytestmark = pytest.mark.skipif(not PHP, reason="PHP CLI is needed for private-state checks")
linux_only = pytest.mark.skipif(sys.platform != "linux", reason="Linux ownership and mode checks require Linux")


def php(code, *args, options=()):
    result = subprocess.run([PHP, "-n", *options, "-r", "require $argv[1]; " + code, str(LIBRARY), *args],
                            capture_output=True, text=True, timeout=5, check=True)
    assert result.stderr == ""
    return json.loads(result.stdout)


@pytest.mark.parametrize("field,value", [
    ("uid", 1001), ("mode", 0o100644), ("mode", 0o120600),
    ("mode", 0o010600), ("mode", 0o104600), ("nlink", 2),
])
def test_rejects_unsafe_file_metadata(field, value):
    metadata = {"uid": 1000, "mode": 0o100600, "nlink": 1}
    metadata[field] = value
    assert php("echo json_encode(nissan_test_private_stat(json_decode($argv[2], true), 1000, false));",
               json.dumps(metadata)) is False


@pytest.mark.parametrize("mode,expected", [(0o040700, True), (0o040755, False), (0o120700, False)])
def test_requires_a_private_real_directory(mode, expected):
    assert php("echo json_encode(nissan_test_private_stat(json_decode($argv[2], true), 1000, true));",
               json.dumps({"uid": 1000, "mode": mode})) is expected


@pytest.mark.parametrize("other,expected", [
    ({"dev": 1, "ino": 2}, True), ({"dev": 2, "ino": 2}, False),
    ({"dev": 1, "ino": 3}, False), ({}, False), (None, False),
])
def test_requires_descriptor_and_path_identity(other, expected):
    assert php("echo json_encode(nissan_test_same_file(['dev' => 1, 'ino' => 2], json_decode($argv[2], true)));",
               json.dumps(other)) is expected


def opened(directory):
    return php("$f = nissan_test_open_state($argv[2]); echo json_encode(is_resource($f)); "
               "if (is_resource($f)) { fclose($f); }", str(directory))


@linux_only
def test_creates_private_state_and_reopens_without_truncating(tmp_path):
    directory = tmp_path / "state-directory"
    assert opened(directory)
    state = directory / "state"
    assert directory.stat().st_mode & 0o7777 == 0o700
    assert state.stat().st_mode & 0o7777 == 0o600
    assert directory.stat().st_uid == state.stat().st_uid == os.geteuid()
    state.write_bytes(b"synthetic-existing-state")
    assert opened(directory)
    assert state.read_bytes() == b"synthetic-existing-state"


@linux_only
@pytest.mark.parametrize("target,mode", [("directory", 0o755), ("state", 0o644), ("state", 0o660)])
def test_rejects_existing_permissions_without_repair_or_truncation(tmp_path, target, mode):
    directory = tmp_path / "state-directory"
    assert opened(directory)
    state = directory / "state"
    state.write_bytes(b"synthetic-existing-state")
    path = directory if target == "directory" else state
    path.chmod(mode)
    assert not opened(directory)
    assert path.stat().st_mode & 0o7777 == mode
    assert state.read_bytes() == b"synthetic-existing-state"


@linux_only
@pytest.mark.parametrize("target", ["directory", "state"])
def test_does_not_follow_symlinks_or_touch_their_targets(tmp_path, target):
    outside = tmp_path / "outside"
    outside.mkdir(mode=0o700)
    sentinel = outside / "state"
    sentinel.write_bytes(b"synthetic-sentinel")
    sentinel.chmod(0o600)
    directory = tmp_path / "state-directory"
    if target == "directory":
        directory.symlink_to(outside, target_is_directory=True)
    else:
        directory.mkdir(mode=0o700)
        (directory / "state").symlink_to(sentinel)
    assert not opened(directory)
    assert sentinel.read_bytes() == b"synthetic-sentinel"


@linux_only
def test_rejects_hardlinked_state(tmp_path):
    directory = tmp_path / "state-directory"
    assert opened(directory)
    state = directory / "state"
    state.write_bytes(b"synthetic-sentinel")
    os.link(state, tmp_path / "second-link")
    assert not opened(directory)
    assert state.read_bytes() == b"synthetic-sentinel"


@linux_only
def test_rejects_fifo_before_opening(tmp_path):
    directory = tmp_path / "state-directory"
    directory.mkdir(mode=0o700)
    os.mkfifo(directory / "state", 0o600)
    assert not opened(directory)


@linux_only
def test_rejects_a_writable_parent_without_sticky_protection(tmp_path):
    parent = tmp_path / "untrusted-parent"
    parent.mkdir(mode=0o700)
    parent.chmod(0o777)
    directory = parent / "state-directory"
    try:
        assert not opened(directory)
        assert not directory.exists()
    finally:
        parent.chmod(0o700)


@linux_only
def test_restores_caller_umask_on_success_and_rejection(tmp_path):
    good = tmp_path / "private"
    bad = tmp_path / "public"
    bad.mkdir()
    bad.chmod(0o755)
    result = php("umask(0027); $a = nissan_test_open_state($argv[2]); "
                 "if (is_resource($a)) { fclose($a); } $afterSuccess = umask(); "
                 "$b = nissan_test_open_state($argv[3]); "
                 "echo json_encode([$afterSuccess, $b === false, umask()]);", str(good), str(bad))
    assert result == [0o027, True, 0o027]


@linux_only
def test_uid_fallback_works_without_php_posix(tmp_path):
    assert php("echo json_encode(nissan_test_effective_uid() === (int)$argv[2]);",
               str(os.geteuid()), options=("-d", "disable_functions=posix_geteuid"))


@pytest.mark.skipif(sys.platform == "linux", reason="Unsupported-platform check applies outside Linux")
def test_unsupported_platform_does_not_infer_unix_ownership():
    assert php("echo json_encode(nissan_test_effective_uid());") is None
