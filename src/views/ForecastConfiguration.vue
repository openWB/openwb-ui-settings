<template>
  <div class="forecastConfig">
    <form name="forecastConfigForm">
      <openwb-base-card title="PV-Prognose">
        <openwb-base-alert subtype="info">
          Wähle einen Forecast-Anbieter und hinterlege die erforderlichen Zugangsdaten bzw. Standortparameter.
        </openwb-base-alert>

        <openwb-base-select-input
          title="Anbieter"
          :options="providerOptions"
          :model-value="selectedProviderType"
          @update:model-value="updateProviderType"
        />

        <div v-if="currentForecastProvider.type">
          <openwb-forecast-proxy
            :forecast="currentForecastProvider"
            @update:configuration="updateConfiguration('openWB/optional/forecast/provider', $event)"
          />
        </div>
        <openwb-base-alert
          v-else
          subtype="warning"
        >
          Es ist derzeit kein Forecast-Anbieter aktiv.
        </openwb-base-alert>

        <hr />

        <div class="row justify-content-center mb-1 w-100">
          <div class="col-md-4 d-flex py-1 justify-content-center">
            <button
              type="button"
              class="btn btn-success btn-block btn-sm"
              @click="$emit('save', mqttTopicsToPublish)"
            >
              Einstellungen Speichern
            </button>
          </div>
          <div class="col-md-4 d-flex py-1 justify-content-center">
            <button
              type="button"
              class="btn btn-outline-danger btn-block btn-sm"
              @click="resetProviderAndForecastData"
            >
              Anbieter entfernen und Forecast zuruecksetzen
            </button>
          </div>
        </div>
      </openwb-base-card>

      <openwb-base-card title="Prognose-Info">
        <openwb-base-alert subtype="info">
          Aktuelle Prognose: Heute
          {{ formatNumber($store.state.mqtt["openWB/optional/forecast/get/today_kwh"], 2, 2) || "0.00" }}
          kWh, morgen:
          {{ formatNumber($store.state.mqtt["openWB/optional/forecast/get/tomorrow_kwh"], 2, 2) || "0.00" }}
          kWh
        </openwb-base-alert>
        <openwb-base-text-input
          title="Letzte Aktualisierung"
          readonly
          :model-value="lastUpdateTimeText"
        />
        <openwb-base-text-input
          title="Naechste Aktualisierung"
          readonly
          :model-value="nextQueryTimeText"
        />
        <openwb-base-text-input
          title="Status"
          readonly
          :model-value="faultStatusText"
        />
        <div class="row justify-content-center mb-1 w-100">
          <div class="col-md-4 d-flex py-1 justify-content-center">
            <button
              type="button"
              class="btn btn-outline-primary btn-block btn-sm"
              @click="triggerForecastUpdate"
            >
              Forecast aktualisieren
            </button>
          </div>
        </div>
      </openwb-base-card>

      <openwb-base-card title="Prognose-Verlauf (Leistung)">
        <div class="d-flex justify-content-center mb-2">
          <div class="btn-group btn-group-sm">
            <button
              :class="['btn', forecastDayFilter === 'both' ? 'btn-primary' : 'btn-outline-primary']"
              type="button"
              @click="forecastDayFilter = 'both'"
            >
              Heute + Morgen
            </button>
            <button
              :class="['btn', forecastDayFilter === 'today' ? 'btn-primary' : 'btn-outline-primary']"
              type="button"
              @click="forecastDayFilter = 'today'"
            >
              Heute
            </button>
            <button
              :class="['btn', forecastDayFilter === 'tomorrow' ? 'btn-primary' : 'btn-outline-primary']"
              type="button"
              @click="forecastDayFilter = 'tomorrow'"
            >
              Morgen
            </button>
          </div>
        </div>
        <openwb-base-alert
          v-if="!hasForecastValues"
          subtype="info"
        >
          Noch keine Forecast-Werte vorhanden. Fuehre ggf. "Forecast aktualisieren" aus.
        </openwb-base-alert>
        <div
          v-else
          class="openwb-chart"
        >
          <chartjs-line
            :data="forecastChartData"
            :options="forecastChartOptions"
          />
        </div>
      </openwb-base-card>

      <openwb-base-submit-buttons
        form-name="forecastConfigForm"
        @save="$emit('save', mqttTopicsToPublish)"
        @reset="$emit('reset')"
      />
    </form>
  </div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbForecastProxy from "../components/forecast/OpenwbForecastProxy.vue";
import { Line as ChartjsLine } from "vue-chartjs";
import "chartjs-adapter-luxon";
import {
  Chart,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Filler,
} from "chart.js";

Chart.register(Tooltip, Legend, LineController, LineElement, PointElement, LinearScale, TimeScale, Filler);

export default {
  name: "OpenwbForecastConfiguration",
  components: {
    OpenwbForecastProxy,
    ChartjsLine,
  },
  mixins: [ComponentState],
  emits: ["save", "reset"],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/system/configurable/forecasts", writeable: false },
        { topic: "openWB/optional/forecast/configured", writeable: false },
        { topic: "openWB/optional/forecast/provider", writeable: true },
        { topic: "openWB/optional/forecast/get/values", writeable: false },
        { topic: "openWB/optional/forecast/get/today_values", writeable: false },
        { topic: "openWB/optional/forecast/get/tomorrow_values", writeable: false },
        { topic: "openWB/optional/forecast/get/daily_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/today_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/tomorrow_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/fault_state", writeable: false },
        { topic: "openWB/optional/forecast/get/fault_str", writeable: false },
        { topic: "openWB/optional/forecast/get/next_query_time", writeable: false },
        { topic: "openWB/optional/forecast/get/last_update_time", writeable: false },
      ],
      providerConfigCache: {},
      forecastDayFilter: "both",
    };
  },
  computed: {
    configurableForecasts() {
      const options = this.$store.state.mqtt["openWB/system/configurable/forecasts"];
      return Array.isArray(options) ? options : [];
    },
    providerDefinitionByType() {
      return this.configurableForecasts.reduce((definitions, option) => {
        if (!option || typeof option !== "object" || typeof option.value !== "string") {
          return definitions;
        }
        return {
          ...definitions,
          [option.value]: option,
        };
      }, {});
    },
    providerOptions() {
      const options = this.configurableForecasts.map((option) => {
        const isEmpty = option?.value === null || option?.value === undefined || option?.value === "";
        return {
          value: isEmpty ? "" : option.value,
          text: option?.text || (isEmpty ? "Kein Anbieter" : option.value),
        };
      });
      const selectedType = this.selectedProviderType;
      if (selectedType && !options.some((option) => option.value === selectedType)) {
        options.unshift({
          value: selectedType,
          text: `Unbekannter Anbieter (${selectedType})`,
        });
      }
      if (options.some((option) => option.value === "")) {
        return options;
      }
      return [{ value: "", text: "Kein Anbieter" }, ...options];
    },
    currentForecastProviderRaw() {
      return this.$store.state.mqtt["openWB/optional/forecast/provider"];
    },
    currentForecastProvider() {
      const provider = this.currentForecastProviderRaw;
      if (provider && typeof provider === "object") {
        return this.normalizeProviderObject(provider);
      }
      if (typeof provider === "string") {
        const normalizedType = this.normalizeProviderType(provider);
        if (normalizedType) {
          return this.createProviderByType(normalizedType);
        }
      }
      return { type: null, configuration: {} };
    },
    selectedProviderType() {
      if (typeof this.currentForecastProviderRaw === "string") {
        return this.normalizeProviderType(this.currentForecastProviderRaw) || this.currentForecastProviderRaw || "";
      }
      const currentType = this.currentForecastProvider?.type;
      return this.normalizeProviderType(currentType) || currentType || "";
    },
    forecastValues() {
      const values = this.$store.state.mqtt["openWB/optional/forecast/get/values"];
      return values && typeof values === "object" ? values : {};
    },
    forecastValues48h() {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayStartSec = todayStart.getTime() / 1000;
      const tomorrowStartSec = todayStartSec + 86400;
      const dayAfterStartSec = tomorrowStartSec + 86400;
      return Object.fromEntries(
        Object.entries(this.forecastValues).filter(([timestamp]) => {
          const ts = Number(timestamp);
          if (!Number.isFinite(ts)) return false;
          if (this.forecastDayFilter === "today") return ts >= todayStartSec && ts < tomorrowStartSec;
          if (this.forecastDayFilter === "tomorrow") return ts >= tomorrowStartSec && ts < dayAfterStartSec;
          return ts >= todayStartSec && ts < dayAfterStartSec;
        }),
      );
    },
    hasForecastValues() {
      return Object.keys(this.forecastValues48h).length > 0;
    },
    forecastChartData() {
      const points = Object.entries(this.forecastValues48h)
        .map(([timestamp, value]) => ({
          x: Number(timestamp) * 1000,
          y: Number(value) / 1000,
        }))
        .filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y))
        .sort((a, b) => a.x - b.x);

      return {
        datasets: [
          {
            label: "Forecast Leistung",
            borderColor: "#28a745",
            backgroundColor: "rgba(40, 167, 69, 0.2)",
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 3,
            borderWidth: 2,
            tension: 0.2,
            data: points,
          },
        ],
      };
    },
    forecastChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              title: (items) =>
                items[0]
                  ? new Date(items[0].parsed.x).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                  : "",
              label: (item) => ` ${item.parsed.y.toFixed(2)} kW`,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              tooltipFormat: "dd.MM.yyyy HH:mm",
              displayFormats: {
                hour: "dd.MM HH:mm",
              },
            },
            title: {
              display: true,
              text: "Zeit",
            },
          },
          y: {
            title: {
              display: true,
              text: "Leistung (kW)",
            },
          },
        },
      };
    },
    lastUpdateTimeText() {
      const timestamp = this.$store.state.mqtt["openWB/optional/forecast/get/last_update_time"];
      if (!timestamp) return "-";
      return new Date(Number(timestamp) * 1000).toLocaleString();
    },
    nextQueryTimeText() {
      const timestamp = this.$store.state.mqtt["openWB/optional/forecast/get/next_query_time"];
      if (!timestamp) {
        return "-";
      }
      return new Date(Number(timestamp) * 1000).toLocaleString();
    },
    faultStatusText() {
      const faultText = this.$store.state.mqtt["openWB/optional/forecast/get/fault_str"];
      if (!faultText || faultText.length === 0) {
        return "OK";
      }
      const nextQueryTime = this.$store.state.mqtt["openWB/optional/forecast/get/next_query_time"];
      if (nextQueryTime) {
        const timeStr = new Date(Number(nextQueryTime) * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${faultText} Naechster Versuch: ${timeStr} Uhr.`;
      }
      return faultText;
    },
  },
  watch: {
    currentForecastProviderRaw() {
      this.cacheProviderConfiguration(this.currentForecastProviderRaw);
      this.normalizeProviderTopic();
    },
  },
  mounted() {
    this.normalizeProviderTopic();
  },
  methods: {
    areProvidersEqual(a, b) {
      if (!a || !b || typeof a !== "object" || typeof b !== "object") {
        return a === b;
      }
      const aConfig = a.configuration && typeof a.configuration === "object" ? a.configuration : {};
      const bConfig = b.configuration && typeof b.configuration === "object" ? b.configuration : {};
      return (
        (a.type || null) === (b.type || null) &&
        (a.name || null) === (b.name || null) &&
        Boolean(a.official) === Boolean(b.official) &&
        JSON.stringify(aConfig) === JSON.stringify(bConfig)
      );
    },
    normalizeProviderType(type) {
      if (typeof type !== "string") {
        return null;
      }
      const trimmed = type.trim();
      if (!trimmed) {
        return null;
      }
      if (this.providerDefinitionByType[trimmed]) {
        return trimmed;
      }
      const lowered = trimmed.toLowerCase();
      const knownTypes = Object.keys(this.providerDefinitionByType);
      if (knownTypes.includes(lowered)) {
        return lowered;
      }
      const simplified = lowered.replace(/[^a-z0-9]/g, "");
      const match = knownTypes.find(
        (providerType) => providerType.toLowerCase().replace(/[^a-z0-9]/g, "") === simplified,
      );
      return match || trimmed;
    },
    normalizeProviderObject(provider) {
      if (!provider || typeof provider !== "object") {
        return { type: null, configuration: {} };
      }
      const normalizedType = this.normalizeProviderType(provider.type || provider.name);
      if (!normalizedType) {
        return provider;
      }
      const definition = this.providerDefinitionByType[normalizedType];
      return {
        ...provider,
        name: provider.name || definition?.text || normalizedType,
        type: normalizedType,
        official: typeof provider.official === "boolean" ? provider.official : definition?.official,
        configuration: this.ensureProviderConfiguration(normalizedType, provider.configuration || {}),
      };
    },
    publishForecastProvider(providerConfig) {
      this.$root.doPublish("openWB/set/optional/forecast/provider", providerConfig);
    },
    resetProviderAndForecastData() {
      this.providerConfigCache = {};
      const resetProvider = { type: null, configuration: {} };
      this.updateState("openWB/optional/forecast/provider", resetProvider);
      this.publishForecastProvider(resetProvider);
      this.updateState("openWB/optional/forecast/configured", false);
      this.updateState("openWB/optional/forecast/get/values", {});
      this.updateState("openWB/optional/forecast/get/today_values", {});
      this.updateState("openWB/optional/forecast/get/tomorrow_values", {});
      this.updateState("openWB/optional/forecast/get/daily_kwh", {});
      this.updateState("openWB/optional/forecast/get/today_kwh", 0);
      this.updateState("openWB/optional/forecast/get/tomorrow_kwh", 0);
      this.updateState("openWB/optional/forecast/get/next_query_time", null);
      this.updateState("openWB/optional/forecast/get/fault_state", 0);
      this.updateState("openWB/optional/forecast/get/fault_str", "Kein Fehler.");
      this.$emit("save", this.mqttTopicsToPublish);
    },
    cacheProviderConfiguration(provider) {
      if (!provider || typeof provider !== "object") {
        return;
      }
      const normalizedType = this.normalizeProviderType(provider.type || provider.name);
      if (!normalizedType) {
        return;
      }
      this.providerConfigCache[normalizedType] = {
        ...provider,
        type: normalizedType,
        configuration:
          provider.configuration && typeof provider.configuration === "object" ? { ...provider.configuration } : {},
      };
    },
    ensureProviderConfiguration(type, configuration = {}) {
      const nextConfiguration = {
        ...configuration,
      };
      const hasStringsKey = Object.prototype.hasOwnProperty.call(nextConfiguration, "strings");
      if (hasStringsKey) {
        const hasStrings = Array.isArray(nextConfiguration.strings) && nextConfiguration.strings.length > 0;
        if (!hasStrings) {
          nextConfiguration.strings = [
            {
              name: "Ausrichtung 1",
              peak_power_kw: nextConfiguration.peak_power_kw || 1,
              tilt: nextConfiguration.tilt ?? 30,
              azimuth: nextConfiguration.azimuth ?? 0,
            },
          ];
        }
      }
      return nextConfiguration;
    },
    createProviderByType(type, configuration = undefined) {
      const definition = this.providerDefinitionByType[type];
      const cachedProvider = this.providerConfigCache[type];
      const cachedConfiguration =
        cachedProvider && cachedProvider.configuration && typeof cachedProvider.configuration === "object"
          ? cachedProvider.configuration
          : {};
      if (!definition) {
        return {
          name: type,
          type,
          official: false,
          configuration: this.ensureProviderConfiguration(type, {
            ...cachedConfiguration,
            ...(configuration && typeof configuration === "object" ? configuration : {}),
          }),
        };
      }
      const defaults =
        definition.defaults && typeof definition.defaults === "object"
          ? JSON.parse(JSON.stringify(definition.defaults))
          : { type, configuration: {} };
      return {
        ...defaults,
        name: defaults.name || definition.text || type,
        type,
        official: typeof defaults.official === "boolean" ? defaults.official : Boolean(definition.official),
        configuration: this.ensureProviderConfiguration(type, {
          ...(defaults.configuration && typeof defaults.configuration === "object" ? defaults.configuration : {}),
          ...cachedConfiguration,
          ...(configuration && typeof configuration === "object" ? configuration : {}),
        }),
      };
    },
    normalizeProviderTopic() {
      const provider = this.currentForecastProviderRaw;
      if (typeof provider === "string") {
        const normalizedType = this.normalizeProviderType(provider);
        if (normalizedType) {
          this.updateState("openWB/optional/forecast/provider", this.createProviderByType(normalizedType));
        }
        return;
      }
      const normalizedProvider = this.normalizeProviderObject(provider);
      this.cacheProviderConfiguration(normalizedProvider);
      if (provider && !this.areProvidersEqual(normalizedProvider, provider)) {
        this.updateState("openWB/optional/forecast/provider", normalizedProvider);
      }
    },
    ensureEditableProviderTopic() {
      const topic = "openWB/optional/forecast/provider";
      const provider = this.$store.state.mqtt[topic];
      if (provider && typeof provider === "object") {
        return;
      }
      const fallbackType =
        this.selectedProviderType ||
        (typeof this.currentForecastProviderRaw === "string" ? this.currentForecastProviderRaw : null);
      const normalizedType = this.normalizeProviderType(fallbackType);
      if (!normalizedType) {
        return;
      }
      this.updateState(topic, this.createProviderByType(normalizedType));
    },
    updateProviderType(type) {
      this.cacheProviderConfiguration(this.currentForecastProviderRaw);
      if (!type) {
        // Ignore empty initialization events from the select component.
        // A real user-triggered reset only happens when a provider was selected before.
        if (!this.selectedProviderType) {
          return;
        }
        const resetProvider = { type: null, configuration: {} };
        this.updateState("openWB/optional/forecast/provider", resetProvider);
        this.publishForecastProvider(resetProvider);
        return;
      }
      const normalizedType = this.normalizeProviderType(type);
      if (!normalizedType) {
        return;
      }
      const existing = this.currentForecastProvider;
      const nextProvider = this.createProviderByType(
        normalizedType,
        existing.type === normalizedType ? existing.configuration : {},
      );
      this.updateState("openWB/optional/forecast/provider", nextProvider);
      // Persist provider switch immediately to avoid race conditions with retained state.
      this.publishForecastProvider(nextProvider);
    },
    updateConfiguration(topic, event) {
      if (topic === "openWB/optional/forecast/provider" && event?.object) {
        this.ensureEditableProviderTopic();
      }
      this.updateState(topic, event.value, event.object);
    },
    triggerForecastUpdate() {
      this.$root.doPublish("openWB/set/optional/forecast/get/force_update", true, false);
    },
  },
};
</script>

<style scoped>
.openwb-chart {
  min-height: 420px;
}
</style>
