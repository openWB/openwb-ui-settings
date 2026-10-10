<?php
// Isolated read-only Nissan test; no configuration, MQTT or charging-control writes.
ini_set("display_errors", "0");
require_once __DIR__ . "/connection_test_lib.php";

const NISSAN_TEST_REQUEST_TIME_LIMIT_SECONDS = 80;
const NISSAN_TEST_CORE_PARENT_LEVELS = 5;
const NISSAN_TEST_PYTHON_EXECUTABLE = "/usr/bin/python3";
const NISSAN_TEST_WORKER_RELATIVE_PATH = "/packages/modules/vehicles/nissanconnect/connection_test.py";
const NISSAN_TEST_STATE_DIRECTORY_NAME = "/openwb-nissanconnect-test";
const NISSAN_TEST_HTTP_OK = 200;
const NISSAN_TEST_HTTP_BAD_REQUEST = 400;
const NISSAN_TEST_HTTP_FORBIDDEN = 403;
const NISSAN_TEST_HTTP_METHOD_NOT_ALLOWED = 405;
const NISSAN_TEST_HTTP_TOO_MANY_REQUESTS = 429;
const NISSAN_TEST_HTTP_SERVICE_UNAVAILABLE = 503;

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");
header("X-Content-Type-Options: nosniff");

function nissan_test_reply(int $status, array $body): void
{
  http_response_code($status);
  echo json_encode($body);
  exit();
}

if (($_SERVER["REQUEST_METHOD"] ?? "") !== "POST") {
  header("Allow: POST");
  nissan_test_reply(NISSAN_TEST_HTTP_METHOD_NOT_ALLOWED, ["success" => false, "code" => "invalid_request"]);
}
if (
  !nissan_test_valid_origin($_SERVER) ||
  strtolower(trim(explode(";", $_SERVER["CONTENT_TYPE"] ?? "")[0])) !== "application/json" ||
  (isset($_SERVER["HTTP_SEC_FETCH_SITE"]) && $_SERVER["HTTP_SEC_FETCH_SITE"] !== "same-origin")
) {
  nissan_test_reply(NISSAN_TEST_HTTP_FORBIDDEN, ["success" => false, "code" => "invalid_request"]);
}
$body = file_get_contents("php://input", false, null, 0, NISSAN_TEST_MAX_INPUT_BYTES + 1);
if (
  $body === false ||
  strlen($body) > NISSAN_TEST_MAX_INPUT_BYTES ||
  !nissan_test_valid_input(json_decode($body, true))
) {
  nissan_test_reply(NISSAN_TEST_HTTP_BAD_REQUEST, ["success" => false, "code" => "invalid_input"]);
}

// Inherit the settings web server's access policy. Same-origin checks block browser
// cross-site submissions; they are not a replacement for installation access control.
// A private file holds expiry times and keyed account digests, never raw account data.
$directory = sys_get_temp_dir() . NISSAN_TEST_STATE_DIRECTORY_NAME;
$lock = nissan_test_open_state($directory);
if (!$lock) {
  nissan_test_reply(NISSAN_TEST_HTTP_SERVICE_UNAVAILABLE, ["success" => false, "code" => "unavailable"]);
}
if (!flock($lock, LOCK_EX | LOCK_NB)) {
  nissan_test_reply(NISSAN_TEST_HTTP_TOO_MANY_REQUESTS, [
    "success" => false,
    "code" => "busy",
    "retry_after_seconds" => 0,
  ]);
}
$state = nissan_test_load_state($lock, time());
if ($state === null || count($state["accounts"]) >= NISSAN_TEST_MAX_ACCOUNT_ENTRIES) {
  nissan_test_reply(NISSAN_TEST_HTTP_SERVICE_UNAVAILABLE, ["success" => false, "code" => "unavailable"]);
}
$input = json_decode($body, true);
$account = nissan_test_account_key($state, $input["user_id"]);
$delays = nissan_test_delays($state, $account, time());
if ($delays["retry_after_seconds"] > 0) {
  header("Retry-After: " . $delays["retry_after_seconds"]);
  nissan_test_reply(
    NISSAN_TEST_HTTP_TOO_MANY_REQUESTS,
    array_merge(
      ["success" => false, "code" => $delays["provider_retry_after_seconds"] > 0 ? "provider_delay" : "cooldown"],
      $delays,
    ),
  );
}
// Verify writable state before a query; no local cooldown starts on failure.
if (!nissan_test_store_state($lock, $state)) {
  nissan_test_reply(NISSAN_TEST_HTTP_SERVICE_UNAVAILABLE, ["success" => false, "code" => "unavailable"]);
}
ignore_user_abort(true);
set_time_limit(NISSAN_TEST_REQUEST_TIME_LIMIT_SECONDS);
$worker = dirname(__DIR__, NISSAN_TEST_CORE_PARENT_LEVELS) . NISSAN_TEST_WORKER_RELATIVE_PATH;
$result = nissan_test_run_worker([NISSAN_TEST_PYTHON_EXECUTABLE, "-I", "-B", $worker], $body);
$nowUnixSeconds = time();
$result = nissan_test_record_result($state, $account, $result, $nowUnixSeconds);
if (!nissan_test_store_state($lock, $state)) {
  nissan_test_reply(NISSAN_TEST_HTTP_SERVICE_UNAVAILABLE, ["success" => false, "code" => "unavailable"]);
}
$result = array_merge($result, nissan_test_delays($state, $account, $nowUnixSeconds));
flock($lock, LOCK_UN);
fclose($lock);
nissan_test_reply(NISSAN_TEST_HTTP_OK, $result);
