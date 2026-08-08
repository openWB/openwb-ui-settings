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
        <openwb-base-click-button
          class="btn btn-outline-danger"
          title="Anbieter entfernen und Forecast zuruecksetzen"
          @button-clicked="resetProviderAndForecastData"
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

        <openwb-base-click-button
          class="btn btn-success"
          title="Einstellungen Speichern"
          @button-clicked="$emit('save', mqttTopicsToPublish)"
        />
      </openwb-base-card>

      <openwb-base-card title="Aktuelle Forecast-Werte">
        <openwb-base-alert subtype="info">
          Heute: {{ formatNumber($store.state.mqtt["openWB/optional/forecast/get/today_kwh"], 2, 2) || "0.00" }}
          kWh, morgen:
          {{ formatNumber($store.state.mqtt["openWB/optional/forecast/get/tomorrow_kwh"], 2, 2) || "0.00" }}
          kWh
        </openwb-base-alert>
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
        <openwb-base-click-button
          class="btn btn-outline-primary"
          title="Forecast Jetzt Aktualisieren"
          @button-clicked="triggerForecastUpdate"
        />
      </openwb-base-card>

      <openwb-base-card title="Forecast-Verlauf (Leistung)">
        <openwb-base-alert
          v-if="!hasForecastValues"
          subtype="info"
        >
          Noch keine Forecast-Werte vorhanden. Fuehre ggf. "Forecast Jetzt Aktualisieren" aus.
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

const PROVIDER_DEFINITIONS = {
  openmeteo: {
    name: "Open-Meteo PV Forecast",
    type: "openmeteo",
    official: false,
    configuration: {
      latitude: 0,
      longitude: 0,
      timezone: "Europe/Berlin",
      peak_power_kw: 9.5,
      tilt: 30,
      azimuth: 0,
      system_loss: 0.14,
      irradiance_to_power_factor: 0.2,
      strings: [
        {
          name: "Ausrichtung 1",
          peak_power_kw: 9.5,
          tilt: 30,
          azimuth: 0,
        },
      ],
    },
  },
  forecastsolar: {
    name: "Forecast.Solar",
    type: "forecastsolar",
    official: false,
    configuration: {
      latitude: 0,
      longitude: 0,
      peak_power_kw: 9.5,
      azimuth: 0,
      tilt: 30,
      strings: [
        {
          name: "Ausrichtung 1",
          peak_power_kw: 9.5,
          tilt: 30,
          azimuth: 0,
        },
      ],
    },
  },
  pvnode: {
    name: "PVNode V2",
    type: "pvnode",
    official: false,
    configuration: {
      api_key: "",
      plant_id: "",
    },
  },
};

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
      ],
      providerConfigCache: {
        openmeteo: null,
        forecastsolar: null,
        pvnode: null,
      },
    };
  },
  computed: {
    providerOptions() {
      return [
        { value: "", text: "Kein Anbieter" },
        { value: "openmeteo", text: "Open-Meteo" },
        { value: "forecastsolar", text: "Forecast.Solar" },
        { value: "pvnode", text: "PVNode" },
      ];
    },
    currentForecastProviderRaw() {
      return this.$store.state.mqtt["openWB/optional/forecast/provider"];
    },
    currentForecastProvider() {
      const provider = this.currentForecastProviderRaw;
      if (provider && typeof provider === "object") {
        return provider;
      }
      if (typeof provider === "string" && PROVIDER_DEFINITIONS[provider]) {
        return this.createProviderByType(provider);
      }
      return { type: null, configuration: {} };
    },
    selectedProviderType() {
      if (typeof this.currentForecastProviderRaw === "string") {
        return this.currentForecastProviderRaw;
      }
      return this.currentForecastProvider.type || "";
    },
    forecastValues() {
      const values = this.$store.state.mqtt["openWB/optional/forecast/get/values"];
      return values && typeof values === "object" ? values : {};
    },
    forecastValues48h() {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const endSeconds = nowSeconds + 48 * 3600;
      return Object.fromEntries(
        Object.entries(this.forecastValues).filter(([timestamp]) => {
          const ts = Number(timestamp);
          return Number.isFinite(ts) && ts >= nowSeconds && ts <= endSeconds;
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
        plugins: {
          legend: {
            display: true,
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
    nextQueryTimeText() {
      const timestamp = this.$store.state.mqtt["openWB/optional/forecast/get/next_query_time"];
      if (!timestamp) {
        return "-";
      }
      return new Date(Number(timestamp) * 1000).toLocaleString();
    },
    faultStatusText() {
      const faultText = this.$store.state.mqtt["openWB/optional/forecast/get/fault_str"];
      return faultText && faultText.length > 0 ? faultText : "OK";
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
    resetProviderAndForecastData() {
      this.providerConfigCache = {
        openmeteo: null,
        forecastsolar: null,
        pvnode: null,
      };
      this.updateState("openWB/optional/forecast/provider", { type: null, configuration: {} });
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
      if (!provider || typeof provider !== "object" || !provider.type || !PROVIDER_DEFINITIONS[provider.type]) {
        return;
      }
      this.providerConfigCache[provider.type] = {
        ...provider,
        configuration:
          provider.configuration && typeof provider.configuration === "object" ? { ...provider.configuration } : {},
      };
    },
    ensureProviderConfiguration(type, configuration = {}) {
      const nextConfiguration = {
        ...configuration,
      };
      if (["openmeteo", "forecastsolar"].includes(type)) {
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
      const definition = PROVIDER_DEFINITIONS[type];
      if (!definition) {
        return { type: null, configuration: {} };
      }
      const cachedProvider = this.providerConfigCache[type];
      const cachedConfiguration =
        cachedProvider && cachedProvider.configuration && typeof cachedProvider.configuration === "object"
          ? cachedProvider.configuration
          : {};
      return {
        name: definition.name,
        type: definition.type,
        official: definition.official,
        configuration: this.ensureProviderConfiguration(type, {
          ...definition.configuration,
          ...cachedConfiguration,
          ...(configuration && typeof configuration === "object" ? configuration : {}),
        }),
      };
    },
    normalizeProviderTopic() {
      const provider = this.currentForecastProviderRaw;
      if (typeof provider === "string" && PROVIDER_DEFINITIONS[provider]) {
        this.updateState("openWB/optional/forecast/provider", this.createProviderByType(provider));
      }
    },
    updateProviderType(type) {
      this.cacheProviderConfiguration(this.currentForecastProviderRaw);
      if (!type) {
        this.updateState("openWB/optional/forecast/provider", { type: null, configuration: {} });
        return;
      }
      const existing = this.currentForecastProvider;
      const nextProvider = this.createProviderByType(type, existing.type === type ? existing.configuration : {});
      this.updateState("openWB/optional/forecast/provider", nextProvider);
    },
    updateConfiguration(topic, event) {
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
  min-height: 320px;
}
</style>
