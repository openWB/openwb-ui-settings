<?php
// Module-owned settings test helpers. PHP 7.4+, Linux deployment.

// Sizes below count bytes (PHP strlen/stream limits); durations count seconds.
const NISSAN_TEST_MAX_INPUT_BYTES = 8192;
const NISSAN_TEST_MAX_OUTPUT_BYTES = 8192;
const NISSAN_TEST_MAX_STATE_BYTES = 131072;
const NISSAN_TEST_MAX_PROCESS_STATUS_BYTES = 16384;
const NISSAN_TEST_MAX_USER_ID_BYTES = 320;
const NISSAN_TEST_MAX_PASSWORD_BYTES = 4096;
const NISSAN_TEST_MAX_ACCOUNT_ENTRIES = 1024;
const NISSAN_TEST_WORKER_TIMEOUT_SECONDS = 70.0;
const NISSAN_TEST_ACCOUNT_COOLDOWN_SECONDS = 300;
const NISSAN_TEST_MAX_PROVIDER_DELAY_SECONDS = 86400;
const NISSAN_TEST_WORKER_POLL_MICROSECONDS = 20000;
const NISSAN_TEST_MAX_SOC_PERCENT = 100;
const NISSAN_TEST_STATE_KEY_RANDOM_BYTES = 32;
const NISSAN_TEST_VIN_PATTERN = '/^[A-HJ-NPR-Z0-9]{17}$/';
const NISSAN_TEST_SHA256_HEX_PATTERN = '/^[a-f0-9]{64}$/';
const NISSAN_TEST_ALLOWED_INPUT_FIELDS = ["user_id", "password", "vin"];
const NISSAN_TEST_HTTP_PORT = 80;
const NISSAN_TEST_HTTPS_PORT = 443;
const NISSAN_TEST_SIGKILL = 9;

// POSIX file types, permission bits and descriptors are separate from sizes.
const NISSAN_TEST_FILE_TYPE_MASK = 0170000;
const NISSAN_TEST_DIRECTORY_TYPE = 0040000;
const NISSAN_TEST_REGULAR_FILE_TYPE = 0100000;
const NISSAN_TEST_PERMISSION_MASK = 07777;
const NISSAN_TEST_PRIVATE_DIRECTORY_MODE = 0700;
const NISSAN_TEST_PRIVATE_FILE_MODE = 0600;
const NISSAN_TEST_GROUP_OTHER_WRITE_BITS = 0022;
const NISSAN_TEST_STICKY_BIT = 01000;
const NISSAN_TEST_PRIVATE_UMASK = 0077;
const NISSAN_TEST_ROOT_UID = 0;
const NISSAN_TEST_STDIN_FD = 0;
const NISSAN_TEST_STDOUT_FD = 1;
const NISSAN_TEST_STDERR_FD = 2;

function nissan_test_valid_origin(array $server): bool
{
  $origin = parse_url($server["HTTP_ORIGIN"] ?? "");
  $host = parse_url("http://" . ($server["HTTP_HOST"] ?? ""));
  $scheme = !empty($server["HTTPS"]) && $server["HTTPS"] !== "off" ? "https" : "http";
  if (
    !is_array($origin) ||
    !is_array($host) ||
    !isset($origin["host"], $host["host"]) ||
    isset($origin["user"]) ||
    isset($origin["pass"]) ||
    isset($origin["query"]) ||
    isset($origin["fragment"]) ||
    isset($origin["path"]) ||
    ($origin["scheme"] ?? "") !== $scheme
  ) {
    return false;
  }
  return strtolower($origin["host"]) === strtolower($host["host"]) &&
    ($origin["port"] ?? ($scheme === "https" ? NISSAN_TEST_HTTPS_PORT : NISSAN_TEST_HTTP_PORT)) ===
      ($host["port"] ?? ($scheme === "https" ? NISSAN_TEST_HTTPS_PORT : NISSAN_TEST_HTTP_PORT));
}

function nissan_test_valid_input($input): bool
{
  if (!is_array($input) || array_diff(array_keys($input), NISSAN_TEST_ALLOWED_INPUT_FIELDS)) {
    return false;
  }
  $user = $input["user_id"] ?? null;
  $password = $input["password"] ?? null;
  $vin = $input["vin"] ?? null;
  return is_string($user) &&
    trim($user) !== "" &&
    strlen($user) <= NISSAN_TEST_MAX_USER_ID_BYTES &&
    is_string($password) &&
    $password !== "" &&
    strlen($password) <= NISSAN_TEST_MAX_PASSWORD_BYTES &&
    ($vin === null ||
      $vin === "" ||
      (is_string($vin) && preg_match(NISSAN_TEST_VIN_PATTERN, strtoupper(trim($vin))) === 1));
}

function nissan_test_run_worker(
  array $command,
  string $body,
  float $timeoutSeconds = NISSAN_TEST_WORKER_TIMEOUT_SECONDS
): array {
  $process = @proc_open(
    $command,
    [
      NISSAN_TEST_STDIN_FD => ["pipe", "r"],
      NISSAN_TEST_STDOUT_FD => ["pipe", "w"],
      NISSAN_TEST_STDERR_FD => ["file", PHP_OS_FAMILY === "Windows" ? "NUL" : "/dev/null", "w"],
    ],
    $pipes,
    null,
    null,
    ["bypass_shell" => true],
  );
  if (!is_resource($process)) {
    return ["success" => false, "code" => "unavailable"];
  }
  // The command and all argv values are fixed; user input travels only through stdin.
  $offsetBytes = 0;
  while ($offsetBytes < strlen($body)) {
    $writtenBytes = @fwrite($pipes[NISSAN_TEST_STDIN_FD], substr($body, $offsetBytes));
    if (!$writtenBytes) {
      break;
    }
    $offsetBytes += $writtenBytes;
  }
  fclose($pipes[NISSAN_TEST_STDIN_FD]);
  stream_set_blocking($pipes[NISSAN_TEST_STDOUT_FD], false);
  $output = "";
  $deadlineUnixSeconds = microtime(true) + $timeoutSeconds;
  $failed = false;
  do {
    $output .= stream_get_contents(
      $pipes[NISSAN_TEST_STDOUT_FD],
      NISSAN_TEST_MAX_OUTPUT_BYTES + 1 - min(strlen($output), NISSAN_TEST_MAX_OUTPUT_BYTES + 1),
    );
    $status = proc_get_status($process);
    if (strlen($output) > NISSAN_TEST_MAX_OUTPUT_BYTES || microtime(true) >= $deadlineUnixSeconds) {
      $failed = true;
      proc_terminate($process, NISSAN_TEST_SIGKILL);
      break;
    }
    if ($status["running"]) {
      usleep(NISSAN_TEST_WORKER_POLL_MICROSECONDS);
    }
  } while ($status["running"]);
  if (!$failed) {
    $output .= stream_get_contents($pipes[NISSAN_TEST_STDOUT_FD], NISSAN_TEST_MAX_OUTPUT_BYTES + 1);
  }
  fclose($pipes[NISSAN_TEST_STDOUT_FD]);
  proc_close($process);
  if ($failed || strlen($output) > NISSAN_TEST_MAX_OUTPUT_BYTES || $offsetBytes !== strlen($body)) {
    return ["success" => false, "code" => "timeout"];
  }
  $result = json_decode($output, true);
  if (!is_array($result) || !isset($result["success"], $result["code"]) || !is_bool($result["success"])) {
    return ["success" => false, "code" => "unavailable"];
  }
  return $result;
}

function nissan_test_effective_uid(): ?int
{
  // Linux deployment; do not mistake a Windows stat UID for an ACL check.
  if (PHP_OS_FAMILY !== "Linux") {
    return null;
  }
  if (function_exists("posix_geteuid")) {
    return posix_geteuid();
  }
  // POSIX is optional in PHP. Read only this process's bounded UID record.
  $status = @file_get_contents("/proc/self/status", false, null, 0, NISSAN_TEST_MAX_PROCESS_STATUS_BYTES);
  if (
    !is_string($status) ||
    preg_match('/^Uid:[ \t]+[0-9]+[ \t]+([0-9]+)[ \t]+[0-9]+[ \t]+([0-9]+)[ \t]*$/m', $status, $match) !== 1 ||
    $match[1] !== $match[2]
  ) {
    return null;
  }
  return (int) $match[1];
}

function nissan_test_private_stat($stat, int $uid, bool $directory): bool
{
  return is_array($stat) &&
    ($stat["uid"] ?? null) === $uid &&
    (($stat["mode"] ?? 0) & NISSAN_TEST_FILE_TYPE_MASK) ===
      ($directory ? NISSAN_TEST_DIRECTORY_TYPE : NISSAN_TEST_REGULAR_FILE_TYPE) &&
    (($stat["mode"] ?? 0) & NISSAN_TEST_PERMISSION_MASK) ===
      ($directory ? NISSAN_TEST_PRIVATE_DIRECTORY_MODE : NISSAN_TEST_PRIVATE_FILE_MODE) &&
    ($directory || ($stat["nlink"] ?? 0) === 1);
}

function nissan_test_same_file($left, $right): bool
{
  return is_array($left) &&
    is_array($right) &&
    isset($left["dev"], $left["ino"], $right["dev"], $right["ino"]) &&
    $left["dev"] === $right["dev"] &&
    $left["ino"] === $right["ino"];
}

function nissan_test_open_state(string $directory)
{
  $uid = nissan_test_effective_uid();
  if ($uid === null) {
    return false;
  }
  $parent = dirname($directory);
  clearstatcache(true, $parent);
  $parentStat = @lstat($parent);
  // A writable shared parent needs sticky-directory protection. Do not trust
  // a parent owned by another unprivileged user, even when its mode looks safe.
  if (
    !is_array($parentStat) ||
    (($parentStat["mode"] ?? 0) & NISSAN_TEST_FILE_TYPE_MASK) !== NISSAN_TEST_DIRECTORY_TYPE ||
    !in_array($parentStat["uid"] ?? null, [NISSAN_TEST_ROOT_UID, $uid], true) ||
    (($parentStat["mode"] & NISSAN_TEST_GROUP_OTHER_WRITE_BITS) !== 0 &&
      ($parentStat["mode"] & NISSAN_TEST_STICKY_BIT) === 0)
  ) {
    return false;
  }
  $previousMask = umask(NISSAN_TEST_PRIVATE_UMASK);
  try {
    clearstatcache(true, $directory);
    $beforeDirectory = @lstat($directory);
    if ($beforeDirectory === false) {
      // Another legitimate request may win creation; validate its result.
      @mkdir($directory, NISSAN_TEST_PRIVATE_DIRECTORY_MODE);
      clearstatcache(true, $directory);
      $beforeDirectory = @lstat($directory);
    }
    if (!nissan_test_private_stat($beforeDirectory, $uid, true)) {
      return false;
    }
    $path = $directory . "/state";
    clearstatcache(true, $path);
    $beforeFile = @lstat($path);
    if ($beforeFile !== false && !nissan_test_private_stat($beforeFile, $uid, false)) {
      return false;
    }
    // Exclusive creation does not follow an existing link. Reopening never
    // truncates: inspect the opened descriptor before reading or writing.
    $file = @fopen($path, $beforeFile === false ? "x+b" : "r+b");
    if ($file === false) {
      return false;
    }
    $opened = fstat($file);
    clearstatcache(true, $path);
    $afterFile = @lstat($path);
    clearstatcache(true, $directory);
    $afterDirectory = @lstat($directory);
    if (
      !nissan_test_private_stat($opened, $uid, false) ||
      !nissan_test_private_stat($afterFile, $uid, false) ||
      !nissan_test_private_stat($afterDirectory, $uid, true) ||
      !nissan_test_same_file($beforeDirectory, $afterDirectory) ||
      !nissan_test_same_file($opened, $afterFile) ||
      ($beforeFile !== false && !nissan_test_same_file($beforeFile, $opened))
    ) {
      fclose($file);
      return false;
    }
    return $file;
  } finally {
    umask($previousMask);
  }
}

// Stored expiry fields retain their wire names and contain Unix seconds.
function nissan_test_load_state($lock, int $nowUnixSeconds): ?array
{
  rewind($lock);
  $raw = stream_get_contents($lock, NISSAN_TEST_MAX_STATE_BYTES + 1);
  if ($raw === "") {
    return [
      "key" => bin2hex(random_bytes(NISSAN_TEST_STATE_KEY_RANDOM_BYTES)),
      "accounts" => [],
      "provider_until" => 0,
    ];
  }
  $state = json_decode($raw, true);
  if (
    strlen($raw) > NISSAN_TEST_MAX_STATE_BYTES ||
    !is_array($state) ||
    !is_string($state["key"] ?? null) ||
    !preg_match(NISSAN_TEST_SHA256_HEX_PATTERN, $state["key"]) ||
    !is_array($state["accounts"] ?? null) ||
    !is_int($state["provider_until"] ?? null)
  ) {
    return null;
  }
  foreach ($state["accounts"] as $key => $untilUnixSeconds) {
    if (!preg_match(NISSAN_TEST_SHA256_HEX_PATTERN, (string) $key) || !is_int($untilUnixSeconds)) {
      return null;
    }
    if ($untilUnixSeconds <= $nowUnixSeconds) {
      unset($state["accounts"][$key]);
    }
  }
  return $state;
}

function nissan_test_store_state($lock, array $state): bool
{
  $value = json_encode($state);
  return is_string($value) &&
    strlen($value) <= NISSAN_TEST_MAX_STATE_BYTES &&
    rewind($lock) &&
    ftruncate($lock, 0) &&
    fwrite($lock, $value) === strlen($value) &&
    fflush($lock);
}

function nissan_test_account_key(array $state, string $user): string
{
  return hash_hmac("sha256", strtolower(trim($user)), $state["key"]);
}

function nissan_test_delays(array $state, string $account, int $nowUnixSeconds): array
{
  $accountDelaySeconds = max(
    0,
    min(NISSAN_TEST_ACCOUNT_COOLDOWN_SECONDS, ($state["accounts"][$account] ?? 0) - $nowUnixSeconds),
  );
  $providerDelaySeconds = max(
    0,
    min(NISSAN_TEST_MAX_PROVIDER_DELAY_SECONDS, $state["provider_until"] - $nowUnixSeconds),
  );
  return [
    "account_retry_after_seconds" => $accountDelaySeconds,
    "provider_retry_after_seconds" => $providerDelaySeconds,
    "retry_after_seconds" => max($accountDelaySeconds, $providerDelaySeconds),
  ];
}

function nissan_test_record_result(array &$state, string $account, array $result, int $nowUnixSeconds): array
{
  $query = $result["query"] ?? [];
  if (($result["success"] ?? false) === true) {
    $socPercent = $query["soc"] ?? null;
    $rangeKm = $query["range_km"] ?? null;
    $odometerKm = $query["odometer_km"] ?? null;
    $complete =
      ($query["outcome"] ?? "") === "success" &&
      (is_int($socPercent) || is_float($socPercent)) &&
      is_finite((float) $socPercent) &&
      $socPercent >= 0 &&
      $socPercent <= NISSAN_TEST_MAX_SOC_PERCENT &&
      ($rangeKm === null || ((is_int($rangeKm) || is_float($rangeKm)) && is_finite((float) $rangeKm) && $rangeKm >= 0));
    $complete =
      $complete &&
      ($odometerKm === null ||
        ((is_int($odometerKm) || is_float($odometerKm)) && is_finite((float) $odometerKm) && $odometerKm >= 0));
    foreach (["request_started_at", "completed_at", "measurement_at"] as $field) {
      $complete = $complete && is_string($query[$field] ?? null) && strtotime($query[$field]) !== false;
    }
    if (!$complete) {
      return ["success" => false, "code" => "unavailable"];
    }
    $state["accounts"][$account] = $nowUnixSeconds + NISSAN_TEST_ACCOUNT_COOLDOWN_SECONDS;
  }
  // Nissan does not expose a reliable account-only scope here. Treat its advice
  // conservatively as provider-wide so changing accounts cannot bypass it.
  $delaySeconds = max(
    0,
    min(NISSAN_TEST_MAX_PROVIDER_DELAY_SECONDS, (int) ($query["provider_retry_after_seconds"] ?? 0)),
  );
  $state["provider_until"] = max($state["provider_until"], $nowUnixSeconds + $delaySeconds);
  return $result;
}
