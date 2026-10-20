<template>
  <openwb-base-alert subtype="warning">
    <p>
      Die PV-Prognose liefert eine Vorhersage der zu erwartenden Energieproduktion basierend auf den gewählten Anbietern
      und deren Daten. Diese Daten werden in dieser Version noch nicht für die tatsächliche Regelung verwendet und sind
      lediglich informativ.
    </p>
    <p>
      In zukünftigen Versionen wird die PV-Prognose direkt in die Regelung einfließen und die einzelnen Bereiche wie
      Zielladen, aktive Speichersteuerung und weitere Bereiche beeinflussen, um den Eigenverbrauch weiter zu optimieren.
    </p>
  </openwb-base-alert>
  <div class="forecastConfig">
    <openwb-base-card title="PV-Prognose">
      <form
        ref="configurationForm"
        name="forecastConfigForm"
      >
        <openwb-base-select-input
          title="Anbieter"
          class="mb-2"
          :options="configurableProviders"
          :model-value="currentProvider?.type"
          @update:model-value="updateSelectedProvider"
        />

        <div v-if="currentProvider?.type">
          <openwb-forecast-proxy
            :forecast="currentProvider"
            @update:configuration="updateConfiguration('openWB/optional/forecast/provider', $event)"
          />
        </div>
        <openwb-base-alert
          v-else
          subtype="info"
        >
          Wähle einen Prognose-Anbieter aus und hinterlege die erforderlichen Daten.
        </openwb-base-alert>
      </form>
      <template #footer>
        <openwb-base-submit-buttons
          form-name="forecastConfigForm"
          @save="saveForecastConfiguration"
          @reset="$emit('reset')"
        />
      </template>
    </openwb-base-card>

    <openwb-base-card
      v-if="currentProvider?.type"
      title="Allgemeine Informationen"
    >
      <form name="forecastInfoForm">
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
      </form>
      <template #footer>
        <openwb-base-alert subtype="warning">
          Je nach Anbieter kann die Anzahl der API-Abrufe begrenzt sein. Ein manuelles Aktualisieren kann daher
          fehlschlagen, wenn das Limit bereits erreicht wurde.
        </openwb-base-alert>
        <div class="row justify-content-center w-100">
          <div class="col-md-4 d-flex py-1 justify-content-center">
            <openwb-base-click-button
              class="btn-primary"
              @click="triggerForecastUpdate"
            >
              Prognose aktualisieren
            </openwb-base-click-button>
          </div>
        </div>
      </template>
    </openwb-base-card>

    <openwb-base-card
      v-if="currentProvider?.type"
      title="Prognose (Leistung)"
    >
      <openwb-base-alert
        v-if="!hasForecastValues"
        subtype="info"
      >
        Noch keine Prognose-Werte vorhanden. Führe ggf. "Prognose aktualisieren" aus.
      </openwb-base-alert>
      <div v-else>
        <openwb-base-button-group-input
          v-model="forecastDayFilter"
          title="Zeitraum"
          :buttons="[
            {
              buttonValue: 'today',
              text: 'Heute',
            },
            {
              buttonValue: 'tomorrow',
              text: 'Morgen',
            },
            {
              buttonValue: 'both',
              text: 'Gesamt',
            },
          ]"
        />
        <openwb-base-alert subtype="info">
          <span v-if="forecastDayFilter == 'both'">
            Gesamte Energie:
            <span class="no-wrap">{{ totalEnergyForecast }} kWh</span>, davon heute
            <span class="no-wrap">{{ todayEnergyForecast }} kWh</span>, morgen
            <span class="no-wrap">{{ tomorrowEnergyForecast }} kWh</span>
          </span>
          <span v-if="forecastDayFilter == 'today'">
            Energie heute:
            <span class="no-wrap">{{ todayEnergyForecast }} kWh</span>
          </span>
          <span
            v-if="forecastDayFilter == 'tomorrow'"
            class="no-wrap"
          >
            Energie morgen:
            <span class="no-wrap">{{ tomorrowEnergyForecast }} kWh</span>
          </span>
        </openwb-base-alert>
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
        { topic: "openWB/optional/forecast/configured", writeable: false },
        { topic: "openWB/optional/forecast/get/daily_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/fault_state", writeable: false },
        { topic: "openWB/optional/forecast/get/fault_str", writeable: false },
        { topic: "openWB/optional/forecast/get/last_update_time", writeable: false },
        { topic: "openWB/optional/forecast/get/next_query_time", writeable: false },
        { topic: "openWB/optional/forecast/get/today_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/today_values", writeable: false },
        { topic: "openWB/optional/forecast/get/tomorrow_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/tomorrow_values", writeable: false },
        { topic: "openWB/optional/forecast/get/values", writeable: false },
        { topic: "openWB/optional/forecast/provider", writeable: true },
        { topic: "openWB/system/configurable/forecasts", writeable: false },
      ],
      forecastDayFilter: "both",
    };
  },
  computed: {
    configurableProviders() {
      return this.$store.state.mqtt["openWB/system/configurable/forecasts"];
    },
    currentProvider() {
      return this.$store.state.mqtt["openWB/optional/forecast/provider"];
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
            ticks: {
              callback: this.formatTickLabel,
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
      return this.$store.state.mqtt["openWB/optional/forecast/get/fault_str"];
    },
    todayEnergyForecast() {
      return this.formatNumber(this.$store.state.mqtt["openWB/optional/forecast/get/today_kwh"], 2, 2) || "0.00";
    },
    tomorrowEnergyForecast() {
      return this.formatNumber(this.$store.state.mqtt["openWB/optional/forecast/get/tomorrow_kwh"], 2, 2) || "0.00";
    },
    totalEnergyForecast() {
      return (
        this.formatNumber(
          (this.$store.state.mqtt["openWB/optional/forecast/get/today_kwh"] || 0) +
            (this.$store.state.mqtt["openWB/optional/forecast/get/tomorrow_kwh"] || 0),
          2,
          2,
        ) || "0.00"
      );
    },
  },
  methods: {
    saveForecastConfiguration(event) {
      console.log("Saving forecast configuration:", event);
      this.$emit("save", this.mqttTopicsToPublish);
    },
    getEndOfToday() {
      return new Date().setHours(23, 59, 59, 999).valueOf();
    },
    formatTickLabel(timeValue) {
      const date = new Date(timeValue);
      // Prüfe ob das Datum zum nächsten Tag gehört
      const isTomorrow = this.getEndOfToday() < date;
      // Zeige nur den Zeitwert, wenn es nicht morgen ist
      let label = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      if (isTomorrow) {
        label = date.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" }) + " " + label;
      }
      return label;
    },
    getProviderDefaultConfiguration(type) {
      const providerDefaults = this.configurableProviders.find((element) => element.value == type);
      if (Object.prototype.hasOwnProperty.call(providerDefaults, "defaults")) {
        return {
          ...JSON.parse(JSON.stringify(providerDefaults.defaults)),
        };
      }
      console.warn("no default configuration found for provider type!", type);
      return {};
    },
    updateSelectedProvider(event) {
      this.updateState("openWB/optional/forecast/provider", event, "type");
      this.updateState("openWB/optional/forecast/provider", this.getProviderDefaultConfiguration(event));
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

.no-wrap {
  white-space: nowrap;
}
</style>
