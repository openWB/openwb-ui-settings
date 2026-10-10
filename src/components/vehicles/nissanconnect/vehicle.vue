<template>
  <div class="vehicle-soc-nissanconnect">
    <openwb-base-alert subtype="info">
      Experimental module for Nissan electric vehicles using MyNISSAN in Europe. You must be able to sign in through the
      app. Tested with the Leaf ZE1; other models are unverified. NissanConnect EV is not supported. This uses an
      unofficial API; specific permission from Nissan has not been established, and access may change.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Username"
      aria-label="MyNISSAN username"
      autocomplete="username"
      required
      subtype="user"
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
      <template #help> The email address of your MyNISSAN account. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Password"
      aria-label="MyNISSAN password"
      autocomplete="current-password"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help>
        The password of your MyNISSAN account. Saving stores it in normal openWB settings, without encryption added by
        this module. Settings, backups and detailed logs may contain sensitive account data; keep them private.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Vehicle identification number (VIN)"
      aria-label="Vehicle identification number (VIN)"
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help>
        Required if the account contains multiple vehicles. Leave blank if the account contains only one vehicle.
      </template>
    </openwb-base-text-input>
    <openwb-base-alert subtype="info">
      Retrieves battery data stored by Nissan with its measurement timestamp. The vehicle is not actively woken up. Old
      values retain their original timestamp. Also retrieves the stored odometer when available. Configure query
      intervals and charge limits in openWB.
    </openwb-base-alert>
    <section
      class="mt-3"
      aria-label="Nissan connection test"
    >
      <p>
        Test the entered account details with one passive Nissan query. The test does not save these settings or update
        charging control. Results are confidential. Nissan's stored data may be older than the query.
      </p>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!canTest"
        @click="testConnection"
      >
        {{ testing ? "Testing connection…" : "Test connection" }}
      </button>
      <p
        v-if="cooldownSeconds > 0"
        class="mt-2"
      >
        {{ providerUntilMs > nowMs ? "Nissan requires a pause" : "This account was tested successfully" }}. Another test
        is available in {{ cooldownSeconds }} seconds.
      </p>
      <p
        v-if="testError"
        class="mt-2"
        role="alert"
      >
        {{ testError }}
      </p>
      <div
        v-if="result"
        class="mt-3"
        role="status"
        aria-live="polite"
      >
        <p>Connection successful. These are the vehicle data stored by Nissan.</p>
        <dl>
          <dt>State of charge</dt>
          <dd>{{ result.soc }} %</dd>
          <dt>Range</dt>
          <dd>{{ result.range_km === null ? valueUnavailableText : `${result.range_km} km` }}</dd>
          <dt>Odometer</dt>
          <dd>{{ result.odometer_km === null ? valueUnavailableText : `${result.odometer_km} km` }}</dd>
          <dt>Query started</dt>
          <dd>{{ formatTime(result.request_started_at) }}</dd>
          <dt>Response received</dt>
          <dd>{{ formatTime(result.completed_at) }}</dd>
          <dt>Battery measurement time</dt>
          <dd>{{ formatTime(result.measurement_at) }}</dd>
          <dt>Age of battery data</dt>
          <dd>{{ dataAge }}</dd>
        </dl>
        <p>
          Times are shown in your browser's local time zone. The odometer has no separate measurement timestamp and may
          be older. An unavailable odometer does not affect the battery result. This test does not wake the vehicle.
        </p>
      </div>
      <div
        v-if="result || testError"
        class="mt-2"
      >
        <dl aria-label="Nissan request count">
          <dt>Nissan HTTP requests (this test)</dt>
          <dd>{{ httpRequestCount === null ? valueUnavailableText : httpRequestCount }}</dd>
        </dl>
        <p>
          Counts request attempts, including sign-in, token renewal, battery and odometer requests. Failed attempts also
          count. This is the count for this test only; an unavailable count does not mean zero requests.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

// Browser clocks are Unix milliseconds; endpoint cooldowns are seconds.
const MILLISECONDS_PER_SECOND = 1000;
const CLOCK_UPDATE_INTERVAL_MS = 1000;
const CONNECTION_TEST_TIMEOUT_MS = 75000;
const ACCOUNT_COOLDOWN_SECONDS = 300;
const MAX_PROVIDER_DELAY_SECONDS = 86400;
const MAX_SOC_PERCENT = 100;
const CONNECTION_TEST_URL = "/openWB/web/settings/modules/vehicles/nissanconnect/test_connection.php";
const VALUE_UNAVAILABLE_TEXT = "Not available";
const TEST_TIMEOUT_MESSAGE = "The connection test timed out. No result was accepted.";
const TEST_UNAVAILABLE_MESSAGE = "The connection test is unavailable or returned an invalid result.";
const TEST_CONNECTION_FAILURE_MESSAGE =
  "The connection test could not be completed. Check the connection and installed module endpoint.";
const TEST_ERROR_MESSAGES = Object.freeze({
  invalid_input: "Check username, password and optional VIN.",
  authentication_failed: "Nissan rejected the login. Check your account and any notices in MyNISSAN.",
  rate_limited: "Nissan is limiting requests. Please wait before trying again.",
  cooldown: "This account was tested successfully. Please wait before testing it again.",
  provider_delay: "Nissan requires a pause before another connection test, including other accounts.",
  busy: "A connection test is already running. Please wait.",
  query_failed: "Nissan did not return valid battery data. Check the account and vehicle selection.",
  timeout: TEST_TIMEOUT_MESSAGE,
  agent_environment: "Run live account tests privately, outside a cloud agent session.",
});

export default {
  name: "VehicleSocNissanConnect",
  mixins: [VehicleConfigMixin],
  data() {
    return {
      valueUnavailableText: VALUE_UNAVAILABLE_TEXT,
      testing: false,
      result: null,
      httpRequestCount: null,
      testError: "",
      accountCooldownsUntilMs: new Map(),
      providerUntilMs: 0,
      nowMs: Date.now(),
      testController: null,
      requestSerial: 0,
      clockTimerId: null,
    };
  },
  computed: {
    accountKey() {
      return this.vehicle.configuration.user_id?.trim().toLowerCase() || "";
    },
    cooldownSeconds() {
      const untilMs = Math.max(this.accountCooldownsUntilMs.get(this.accountKey) || 0, this.providerUntilMs);
      return Math.max(0, Math.ceil((untilMs - this.nowMs) / MILLISECONDS_PER_SECOND));
    },
    canTest() {
      const config = this.vehicle.configuration;
      return !this.testing && this.cooldownSeconds === 0 && !!config.user_id?.trim() && !!config.password;
    },
    dataAge() {
      const dataAgeSeconds = Math.round(
        (this.nowMs - Date.parse(this.result.measurement_at)) / MILLISECONDS_PER_SECOND,
      );
      return dataAgeSeconds < 0 ? `${-dataAgeSeconds} seconds ahead of this clock` : `${dataAgeSeconds} seconds`;
    },
  },
  watch: {
    "vehicle.configuration": {
      deep: true,
      handler() {
        this.requestSerial += 1;
        // Let the bounded request finish so its account cooldown is retained.
        this.result = null;
        this.httpRequestCount = null;
        this.testError = "";
      },
    },
  },
  mounted() {
    this.clockTimerId = setInterval(() => {
      this.nowMs = Date.now();
    }, CLOCK_UPDATE_INTERVAL_MS);
  },
  beforeUnmount() {
    this.requestSerial += 1;
    this.testController?.abort();
    clearInterval(this.clockTimerId);
  },
  methods: {
    formatTime(value) {
      return new Date(value).toLocaleString();
    },
    async testConnection() {
      if (!this.canTest) return;
      const serial = ++this.requestSerial;
      const account = this.accountKey;
      this.testing = true;
      this.result = null;
      this.httpRequestCount = null;
      this.testError = "";
      const controller = new AbortController();
      this.testController = controller;
      const requestTimeoutId = setTimeout(() => controller.abort(), CONNECTION_TEST_TIMEOUT_MS);
      const config = this.vehicle.configuration;
      try {
        const response = await fetch(CONNECTION_TEST_URL, {
          method: "POST",
          mode: "same-origin",
          credentials: "same-origin",
          cache: "no-store",
          redirect: "error",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: config.user_id, password: config.password, vin: config.vin }),
          signal: controller.signal,
        });
        const body = await response.json();
        this.nowMs = Date.now();
        if (Number.isFinite(body.account_retry_after_seconds) && body.account_retry_after_seconds > 0) {
          const untilMs =
            this.nowMs + Math.min(ACCOUNT_COOLDOWN_SECONDS, body.account_retry_after_seconds) * MILLISECONDS_PER_SECOND;
          this.accountCooldownsUntilMs.set(account, Math.max(this.accountCooldownsUntilMs.get(account) || 0, untilMs));
        }
        if (Number.isFinite(body.provider_retry_after_seconds) && body.provider_retry_after_seconds > 0) {
          this.providerUntilMs = Math.max(
            this.providerUntilMs,
            this.nowMs +
              Math.min(MAX_PROVIDER_DELAY_SECONDS, body.provider_retry_after_seconds) * MILLISECONDS_PER_SECOND,
          );
        }
        if (serial !== this.requestSerial) return;
        const query = body.query;
        // Unknown counts must not imply that a failed or interrupted test sent no requests.
        this.httpRequestCount =
          Number.isSafeInteger(query?.http_requests) && query.http_requests >= 0 ? query.http_requests : null;
        if (
          response.ok &&
          body.success === true &&
          query?.outcome === "success" &&
          typeof query.soc === "number" &&
          query.soc >= 0 &&
          query.soc <= MAX_SOC_PERCENT &&
          [query.request_started_at, query.completed_at, query.measurement_at].every(
            (value) => typeof value === "string" && Number.isFinite(Date.parse(value)),
          ) &&
          (query.range_km === null || (Number.isFinite(query.range_km) && query.range_km >= 0))
        ) {
          this.result = {
            soc: query.soc,
            range_km: query.range_km,
            odometer_km: Number.isFinite(query.odometer_km) && query.odometer_km >= 0 ? query.odometer_km : null,
            request_started_at: query.request_started_at,
            completed_at: query.completed_at,
            measurement_at: query.measurement_at,
          };
        } else {
          this.testError = TEST_ERROR_MESSAGES[body.code] || TEST_UNAVAILABLE_MESSAGE;
        }
      } catch {
        if (serial === this.requestSerial) {
          this.testError = controller.signal.aborted ? TEST_TIMEOUT_MESSAGE : TEST_CONNECTION_FAILURE_MESSAGE;
        }
      } finally {
        clearTimeout(requestTimeoutId);
        if (this.testController === controller) {
          this.testing = false;
          this.testController = null;
        }
      }
    },
  },
};
</script>
