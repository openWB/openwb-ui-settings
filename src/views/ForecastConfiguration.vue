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

        <openwb-base-click-button
          class="btn btn-outline-primary"
          title="Forecast Jetzt Aktualisieren"
          @button-clicked="triggerForecastUpdate"
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
        <openwb-base-textarea
          title="Tageswerte (kWh)"
          subtype="json"
          :model-value="$store.state.mqtt['openWB/optional/forecast/get/daily_kwh'] || {}"
          readonly
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
    official: true,
    configuration: {
      latitude: 0,
      longitude: 0,
      timezone: "Europe/Berlin",
      peak_power_kw: 9.5,
      tilt: 30,
      azimuth: 0,
      system_loss: 0.14,
      irradiance_to_power_factor: 0.2,
      strings: [],
    },
  },
  forecastsolar: {
    name: "Forecast.Solar",
    type: "forecastsolar",
    official: true,
    configuration: {
      latitude: 0,
      longitude: 0,
      peak_power_kw: 9.5,
      azimuth: 0,
      tilt: 30,
      strings: [],
    },
  },
  pvnode: {
    name: "PVNode V2",
    type: "pvnode",
    official: true,
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
    hasForecastValues() {
      return Object.keys(this.forecastValues).length > 0;
    },
    forecastChartData() {
      const points = Object.entries(this.forecastValues)
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
      this.normalizeProviderTopic();
    },
  },
  mounted() {
    this.normalizeProviderTopic();
  },
  methods: {
    createProviderByType(type, configuration = undefined) {
      const definition = PROVIDER_DEFINITIONS[type];
      if (!definition) {
        return { type: null, configuration: {} };
      }
      return {
        name: definition.name,
        type: definition.type,
        official: definition.official,
        configuration: {
          ...definition.configuration,
          ...(configuration && typeof configuration === "object" ? configuration : {}),
        },
      };
    },
    normalizeProviderTopic() {
      const provider = this.currentForecastProviderRaw;
      if (typeof provider === "string" && PROVIDER_DEFINITIONS[provider]) {
        this.updateState("openWB/optional/forecast/provider", this.createProviderByType(provider));
      }
    },
    updateProviderType(type) {
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
