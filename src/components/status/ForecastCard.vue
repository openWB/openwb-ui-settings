<template>
  <status-card
    v-if="forecastConfigured"
    subtype="secondary"
    :state="faultState"
    :state-message="faultStateMessage"
  >
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'cloud-sun']" />
      PV-Prognose
    </template>
    <template #header-right>{{ currentForecast }}&nbsp;kW</template>
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <template #header>Prognoseinformationen</template>
      <div
        v-if="providerName"
        class="row"
      >
        <div class="col-xl-3 pr-0">Anbieter:</div>
        <div class="col ml-3">
          {{ providerName }}
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      v-if="providerName"
      title="Prognostizierte Erzeugung"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col"></div>
        <div class="col text-right">Energie</div>
      </div>
      <div class="row">
        <div class="col text-right">Heute</div>
        <div class="col text-right text-monospace">{{ todayEnergyForecast }}&nbsp;kWh</div>
      </div>
      <div class="row">
        <div class="col text-right">Morgen</div>
        <div class="col text-right text-monospace">{{ tomorrowEnergyForecast }}&nbsp;kWh</div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="openwb-chart">
        <chartjs-line
          v-if="chartDataRead"
          ref="myChart"
          :data="chartDataObject"
          :options="dynamicChartOptions"
        />
      </div>
    </openwb-base-card>
  </status-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import StatusCard from "./StatusCard.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCloudSun as fasCloudSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCloudSun);

import { Line as ChartjsLine } from "vue-chartjs";
import "chartjs-adapter-luxon";
import "hammerjs";
import ZoomPlugin from "chartjs-plugin-zoom";
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
Chart.register(Tooltip, Legend, LineController, LineElement, PointElement, LinearScale, TimeScale, Filler, ZoomPlugin);

export default {
  name: "ForecastCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
    ChartjsLine,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/optional/forecast/configured", writeable: false },
        { topic: "openWB/optional/forecast/get/fault_state", writeable: false },
        { topic: "openWB/optional/forecast/get/fault_str", writeable: false },
        { topic: "openWB/optional/forecast/get/today_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/tomorrow_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/values", writeable: false },
        { topic: "openWB/optional/forecast/provider", writeable: false },
      ],
      chartDatasets: {
        datasets: [
          {
            label: "Prognose Leistung",
            unit: "kW",
            type: "line",
            borderColor: "#28a745",
            backgroundColor: "rgba(40, 167, 69, 0.2)",
            fill: true,
            pointStyle: "circle",
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.2,
            hidden: false,
            borderWidth: 1,
            data: undefined,
            yAxisID: "y",
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: "power",
            },
          },
        ],
      },
      chartOptions: {
        plugins: {
          title: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
          legend: {
            display: true,
            position: "top",
            labels: {
              filter: function (legendItem, chartData) {
                // Nur sichtbare Datasets in der Legende anzeigen
                return !chartData.datasets[legendItem.datasetIndex].hidden;
              },
            },
          },
        },
        elements: {
          point: {
            radius: 2,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "hour",
              // tooltipFormat: "DD T",
              text: "Zeit",
              maxTicksLimit: 24,
            },
            display: true,
            title: {
              display: true,
              text: "Uhrzeit",
            },
            ticks: {
              font: {
                size: 12,
              },
              callback: this.formatTickLabel,
              // color: tickColor,
              maxTicksLimit: 0,
            },
            grid: {
              // color: xGridColor,
            },
          },
          y: {
            position: "left",
            type: "linear",
            display: "auto",
            suggestedMin: 0,
            title: {
              font: {
                size: 12,
              },
              display: true,
              text: "Leistung [kW]",
              // color: fontColor
            },
            grid: {
              // color: gridColor
            },
            ticks: {
              font: {
                size: 12,
              },
              maxTicksLimit: 11,
              // color: tickColor
            },
          },
        },
      },
    };
  },
  computed: {
    forecastConfigured() {
      return this.$store.state.mqtt["openWB/optional/forecast/configured"];
    },
    chartDataRead() {
      const datasets = this.chartDataObject.datasets;
      // Prüfe, ob mindestens ein Dataset Daten hat
      return datasets.some((dataset) => dataset.data !== undefined && !dataset.hidden);
    },
    chartDataObject() {
      const dataObject = JSON.parse(JSON.stringify(this.chartDatasets)); // Deep copy
      const endOfToday = this.getEndOfToday();

      if (this.$store.state.mqtt["openWB/optional/forecast/get/values"]) {
        var chartEntries = this.$store.state.mqtt["openWB/optional/forecast/get/values"];
        var myData = [];
        // proper scaling:
        // timestamp: seconds -> milliseconds
        // power: Wh je Intervall -> kW
        for (const [key, value] of Object.entries(chartEntries)) {
          myData.push({
            timestamp: key * 1000,
            power: value / 1000,
          });
        }
        myData.sort((a, b) => a.timestamp - b.timestamp);
        // repeat last dataset
        if (myData.length > 0) {
          const lastData = myData.slice(-1)[0];
          // midnight as default
          let nextTimestamp = endOfToday;
          if (myData.length > 1) {
            // same offset minus 1ms as the last one
            const previousData = myData.slice(-2, -1)[0];
            nextTimestamp = lastData.timestamp + lastData.timestamp - previousData.timestamp - 1;
          }
          myData.push({
            timestamp: nextTimestamp,
            power: lastData.power,
          });
        }
        dataObject.datasets[0].data = myData;
      } else {
        dataObject.datasets[0].hidden = true;
      }

      return dataObject;
    },
    currentForecast() {
      if (this.chartDataObject.datasets[0].data === undefined || this.chartDataObject.datasets[0].data.length === 0) {
        return this.formatNumber(0, 2);
      }
      const now = Date.now();
      const entries = this.chartDataObject.datasets[0].data;
      // anders als bei den Strompreisen enthalten die Prognosewerte auch bereits vergangene
      // Slots des Tages, daher reicht hier nicht einfach der erste Eintrag
      const currentSlot = [...entries].reverse().find((entry) => entry.timestamp <= now) || entries[0];
      return this.formatNumber(currentSlot.power || 0, 2);
    },
    providerName() {
      return this.$store.state.mqtt["openWB/optional/forecast/provider"]?.name || null;
    },
    faultState() {
      return this.$store.state.mqtt["openWB/optional/forecast/get/fault_state"] || 0;
    },
    faultStateMessage() {
      if (!this.providerName) {
        return undefined;
      }
      return this.$store.state.mqtt["openWB/optional/forecast/get/fault_str"];
    },
    todayEnergyForecast() {
      return this.formatNumber(this.$store.state.mqtt["openWB/optional/forecast/get/today_kwh"], 2, 2) || "0.00";
    },
    tomorrowEnergyForecast() {
      return this.formatNumber(this.$store.state.mqtt["openWB/optional/forecast/get/tomorrow_kwh"], 2, 2) || "0.00";
    },
    showLegend() {
      return false;
    },
    dynamicChartOptions() {
      const options = JSON.parse(JSON.stringify(this.chartOptions)); // Deep copy
      options.plugins.legend.display = this.showLegend;
      // Setze den korrekten Callback für die Tick-Labels
      options.scales.x.ticks.callback = this.formatTickLabel;
      return options;
    },
  },
  methods: {
    getEndOfToday() {
      return new Date().setHours(23, 59, 59, 999).valueOf();
    },
    formatTickLabel(timeValue) {
      const date = new Date(timeValue);
      // Prüfe ob das Datum zum nächsten Tag gehört
      const isTomorrow = this.getEndOfToday() < date;
      // Zeige nur den Zeitwert, wenn es nicht morgen ist
      return `${isTomorrow ? date.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" }) + " " : ""}${date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
    },
  },
};
</script>

<style scoped>
.openwb-chart {
  min-height: 250px;
}
</style>
