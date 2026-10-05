<template>
  <div class="forecastConfig">
    <openwb-base-card title="PV-Prognose">
      <openwb-base-alert subtype="info">
        Wähle einen Prognose-Anbieter und hinterlege die erforderlichen Zugangsdaten bzw. Standortparameter.
      </openwb-base-alert>

      <form name="forecastConfigForm">
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
          Es ist derzeit kein Prognose-Anbieter aktiv.
        </openwb-base-alert>
      </form>
      <template #footer>
        <openwb-base-submit-buttons
          form-name="forecastConfigForm"
          @save="$emit('save', mqttTopicsToPublish)"
          @reset="$emit('reset')"
        />
      </template>
    </openwb-base-card>

    <openwb-base-card
      v-if="currentForecastProvider?.type !== null"
      title="Prognose-Info"
    >
      <form name="forecastInfoForm">
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
        >
          <template #prepend>
            <font-awesome-icon :icon="['fas', 'calendar-day']" />
          </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="Nächste Aktualisierung"
          readonly
          :model-value="nextQueryTimeText"
        >
          <template #help>
            Die Prognose wird automatisch um 05:00, 08:00, 11:00, 14:00, 17:00 und 20:00 Uhr aktualisiert.
          </template>
          <template #prepend>
            <font-awesome-icon :icon="['fas', 'calendar-day']" />
          </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="Status"
          readonly
          :model-value="faultStateText"
        >
          <template #prepend>
            <font-awesome-icon
              :class="stateClass"
              :icon="stateIcon"
            />
          </template>
        </openwb-base-text-input>
        <div class="row justify-content-center mb-1 w-100">
          <div class="col-md-4 d-flex py-1 justify-content-center">
            <openwb-base-click-button
              class="btn-primary"
              @click="triggerForecastUpdate"
            >
              Prognose aktualisieren
            </openwb-base-click-button>
          </div>
        </div>
        <openwb-base-alert subtype="warning">
          Je nach Anbieter ist die Anzahl der API-Aufrufe pro Stunde begrenzt (z.B. Forecast.Solar: 12 Aufrufe/Stunde).
          Ein manuelles Aktualisieren kann daher fehlschlagen, wenn das Limit bereits erreicht wurde.
        </openwb-base-alert>
      </form>
    </openwb-base-card>

    <openwb-base-card
      v-if="currentForecastProvider?.type !== null"
      title="Prognose-Verlauf (Leistung)"
    >
      <openwb-base-alert
        v-if="!hasForecastValues"
        subtype="info"
      >
        Noch keine Prognose-Werte vorhanden. Führe ggf. "Prognose aktualisieren" aus.
      </openwb-base-alert>
      <div v-else>
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
        <div class="openwb-chart">
          <chartjs-line
            :data="forecastChartData"
            :options="forecastChartOptions"
          />
        </div>
      </div>
    </openwb-base-card>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCalendarDay as fasCalendarDay,
  faCircleCheck as fasCircleCheck,
  faExclamationTriangle as fasExclamationTriangle,
  faTimesCircle as fasTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCalendarDay, fasCircleCheck, fasExclamationTriangle, fasTimesCircle);

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
    FontAwesomeIcon,
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
      return provider && typeof provider === "object" ? provider : { type: null, configuration: {} };
    },
    selectedProviderType() {
      return this.currentForecastProvider?.type || "";
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
            label: "Prognose Leistung",
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
    faultState() {
      return this.$store.state.mqtt["openWB/optional/forecast/get/fault_state"] || 0;
    },
    stateIcon() {
      switch (this.faultState) {
        case 1:
          return ["fas", "exclamation-triangle"];
        case 2:
          return ["fas", "times-circle"];
        default:
          return ["fas", "check-circle"];
      }
    },
    stateClass() {
      switch (this.faultState) {
        case 0:
          return "success";
        case 1:
          return "warning";
        case 2:
          return "danger";
        default:
          return "dark"; // Default case for all other values
      }
    },
    faultStateText() {
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
        return `${faultText} Nächste Aktualisierung: ${timeStr} Uhr.`;
      }
      return faultText;
    },
  },
  watch: {
    currentForecastProviderRaw(provider) {
      this.cacheProviderConfiguration(provider);
    },
  },
  mounted() {
    this.cacheProviderConfiguration(this.currentForecastProviderRaw);
  },
  methods: {
    publishForecastProvider(providerConfig) {
      this.$root.doPublish("openWB/set/optional/forecast/provider", providerConfig);
    },
    cacheProviderConfiguration(provider) {
      if (!provider || typeof provider !== "object") {
        return;
      }
      const providerType = provider.type;
      if (typeof providerType !== "string" || !providerType) {
        return;
      }
      this.providerConfigCache[providerType] = {
        ...provider,
        type: providerType,
        configuration:
          provider.configuration && typeof provider.configuration === "object" ? { ...provider.configuration } : {},
      };
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
          configuration: {
            ...cachedConfiguration,
            ...(configuration && typeof configuration === "object" ? configuration : {}),
          },
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
        configuration: {
          ...(defaults.configuration && typeof defaults.configuration === "object" ? defaults.configuration : {}),
          ...cachedConfiguration,
          ...(configuration && typeof configuration === "object" ? configuration : {}),
        },
      };
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
      const existing = this.currentForecastProvider;
      const nextProvider = this.createProviderByType(type, existing.type === type ? existing.configuration : {});
      this.updateState("openWB/optional/forecast/provider", nextProvider);
      // Persist provider switch immediately to avoid race conditions with retained state.
      // this.publishForecastProvider(nextProvider);
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
  min-height: 420px;
}

.success {
  color: var(--success);
}

.warning {
  color: var(--warning);
}

.danger {
  color: var(--danger);
}

.dark {
  color: var(--dark);
}
</style>
