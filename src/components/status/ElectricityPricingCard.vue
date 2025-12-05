<template>
  <status-card
    v-if="electricityPricingConfigured"
    subtype="secondary"
    :state="combinedState"
    :state-message="combinedStateMessage"
  >
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'ranking-star']" />
      Variable Strompreise
    </template>
    <template #header-right>{{ currentPrice }}&nbsp;ct/kWh</template>
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <template #header>
        <span v-if="tariffProvider">Stromtarif: {{ tariffProvider }}</span>
        <br v-if="tariffProvider && gridFeeProvider" />
        <span v-if="gridFeeProvider">Netzentgelte: {{ gridFeeProvider }}</span>
      </template>
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
import { faRankingStar as fasRankingStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasRankingStar);

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
  name: "ElectricityPricingCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
    ChartjsLine,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/optional/ep/flexible_tariff/provider",
        "openWB/optional/ep/flexible_tariff/get/fault_state",
        "openWB/optional/ep/flexible_tariff/get/fault_str",
        "openWB/optional/ep/grid_fee/provider",
        "openWB/optional/ep/grid_fee/get/fault_state",
        "openWB/optional/ep/grid_fee/get/fault_str",
        "openWB/optional/ep/get/prices",
        "openWB/optional/ep/flexible_tariff/get/prices",
        "openWB/optional/ep/grid_fee/get/prices",
      ],
      chartDatasets: {
        datasets: [
          {
            label: "Gesamtpreis",
            unit: "ct/kWh",
            type: "line",
            stepped: true,
            borderColor: "rgba(255, 149, 0, 0.9)",
            backgroundColor: "rgba(255, 149, 0, 0.7)",
            fill: false,
            pointStyle: "circle",
            pointRadius: 0,
            pointHoverRadius: 4,
            cubicInterpolationMode: "monotone",
            hidden: false,
            borderWidth: 1,
            data: undefined,
            yAxisID: "y",
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: "price",
            },
          },
          {
            label: "Stromtarif",
            unit: "ct/kWh",
            type: "line",
            stepped: true,
            borderColor: "rgba(139, 0, 0, 0.9)",
            backgroundColor: "rgba(139, 0, 0, 0.9)",
            fill: false,
            pointStyle: "circle",
            pointRadius: 0,
            pointHoverRadius: 4,
            cubicInterpolationMode: "monotone",
            hidden: false,
            borderWidth: 1,
            data: undefined,
            yAxisID: "y",
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: "price",
            },
          },
          {
            label: "Netzentgelt",
            unit: "ct/kWh",
            type: "line",
            stepped: true,
            borderColor: "rgba(255, 0, 0, 0.4)",
            backgroundColor: "rgba(255, 0, 0, 0.4)",
            fill: false,
            pointStyle: "circle",
            pointRadius: 0,
            pointHoverRadius: 4,
            cubicInterpolationMode: "monotone",
            hidden: false,
            borderWidth: 1,
            data: undefined,
            yAxisID: "y",
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: "price",
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
            // suggestedMin: 0,
            // suggestedMax: 0,
            title: {
              font: {
                size: 12,
              },
              display: true,
              text: "Preis [ct/kWh]",
              // color: fontColor
            },
            grid: {
              // color: gridColor
            },
            ticks: {
              font: {
                size: 12,
              },
              stepSize: 0.01,
              maxTicksLimit: 11,
              // color: tickColor
            },
          },
        },
      },
    };
  },
  computed: {
    electricityPricingConfigured() {
      const flexible_tariff_provider = this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/provider"];
      const grid_fee_provider = this.$store.state.mqtt["openWB/optional/ep/grid_fee/provider"];

      // Zeige die Karte an, wenn mindestens ein Provider konfiguriert ist (auch mit Fehlern)
      return (
        (flexible_tariff_provider && flexible_tariff_provider.type) || (grid_fee_provider && grid_fee_provider.type)
      );
    },
    chartDataRead() {
      const datasets = this.chartDataObject.datasets;
      // Prüfe, ob mindestens ein Dataset Daten hat
      return datasets.some((dataset) => dataset.data !== undefined && !dataset.hidden);
    },
    chartDataObject() {
      const dataObject = JSON.parse(JSON.stringify(this.chartDatasets)); // Deep copy

      // Hauptpreis-Feed (Gesamtpreis)
      if (this.$store.state.mqtt["openWB/optional/ep/get/prices"]) {
        var chartEntries = this.$store.state.mqtt["openWB/optional/ep/get/prices"];
        var myData = [];
        // proper scaling:
        // timestamp: seconds -> milliseconds
        // price: €/Wh -> €/kWh
        for (const [key, value] of Object.entries(chartEntries)) {
          myData.push({
            timestamp: key * 1000,
            price: value * 100000,
          });
        }
        // repeat last dataset
        const lastData = myData.slice(-1)[0];
        // midnight as default
        let nextTimestamp = this.endOfToday;
        if (myData.length > 1) {
          // same offset minus 1ms as the last one
          const previousData = myData.slice(-2, -1)[0];
          nextTimestamp = lastData.timestamp + lastData.timestamp - previousData.timestamp - 1;
        }
        myData.push({
          timestamp: nextTimestamp,
          price: lastData.price,
        });
        dataObject.datasets[0].data = myData;
      }

      // Stromtarif-Preise
      if (
        this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/provider"]?.type &&
        this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/get/prices"]
      ) {
        var flexibleTariffEntries = this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/get/prices"];
        var flexibleTariffData = [];
        for (const [key, value] of Object.entries(flexibleTariffEntries)) {
          flexibleTariffData.push({
            timestamp: key * 1000,
            price: value * 100000,
          });
        }
        // repeat last dataset
        if (flexibleTariffData.length > 0) {
          const lastData = flexibleTariffData.slice(-1)[0];
          let nextTimestamp = this.endOfToday;
          if (flexibleTariffData.length > 1) {
            const previousData = flexibleTariffData.slice(-2, -1)[0];
            nextTimestamp = lastData.timestamp + lastData.timestamp - previousData.timestamp - 1;
          }
          flexibleTariffData.push({
            timestamp: nextTimestamp,
            price: lastData.price,
          });
        }
        dataObject.datasets[1].data = flexibleTariffData;
      } else {
        dataObject.datasets[1].hidden = true;
      }

      // Netzentgelt-Preise
      if (
        this.$store.state.mqtt["openWB/optional/ep/grid_fee/provider"]?.type &&
        this.$store.state.mqtt["openWB/optional/ep/grid_fee/get/prices"]
      ) {
        var gridFeeEntries = this.$store.state.mqtt["openWB/optional/ep/grid_fee/get/prices"];
        var gridFeeData = [];
        for (const [key, value] of Object.entries(gridFeeEntries)) {
          gridFeeData.push({
            timestamp: key * 1000,
            price: value * 100000,
          });
        }
        // repeat last dataset
        if (gridFeeData.length > 0) {
          const lastData = gridFeeData.slice(-1)[0];
          let nextTimestamp = this.endOfToday;
          if (gridFeeData.length > 1) {
            const previousData = gridFeeData.slice(-2, -1)[0];
            nextTimestamp = lastData.timestamp + lastData.timestamp - previousData.timestamp - 1;
          }
          gridFeeData.push({
            timestamp: nextTimestamp,
            price: lastData.price,
          });
        }
        dataObject.datasets[2].data = gridFeeData;
      } else {
        dataObject.datasets[2].hidden = true;
      }

      return dataObject;
    },
    currentPrice() {
      if (this.chartDataObject.datasets[0].data === undefined || this.chartDataObject.datasets[0].data.length === 0) {
        return this.formatNumber(0, 2);
      }
      return this.formatNumber(this.chartDataObject.datasets[0].data[0].price || 0, 2);
    },
    endOfToday() {
      return new Date().setHours(23, 59, 59, 999).valueOf();
    },
    baseTopic: {
      get() {
        return "openWB/optional/ep/flexible_tariff";
      },
    },
    combinedState() {
      const flexibleTariffState = this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/get/fault_state"] || 0;
      const gridFeeState = this.$store.state.mqtt["openWB/optional/ep/grid_fee/get/fault_state"] || 0;
      return Math.max(flexibleTariffState, gridFeeState);
    },
    combinedStateMessage() {
      const messages = [];

      // Flexible Tariff
      if (this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/provider"]?.type) {
        const state = this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/get/fault_state"] || 0;
        const message =
          state > 0 ? this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/get/fault_str"] : "Kein Fehler.";
        messages.push(`Stromtarif: ${message}`);
      }

      // Grid Fee
      if (this.$store.state.mqtt["openWB/optional/ep/grid_fee/provider"]?.type) {
        const state = this.$store.state.mqtt["openWB/optional/ep/grid_fee/get/fault_state"] || 0;
        const message =
          state > 0 ? this.$store.state.mqtt["openWB/optional/ep/grid_fee/get/fault_str"] : "Kein Fehler.";
        messages.push(`Netzentgelt: ${message}`);
      }

      return messages.length > 0 ? messages.join("\n") : undefined;
    },
    tariffProvider() {
      return this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/provider"]?.name || null;
    },
    gridFeeProvider() {
      return this.$store.state.mqtt["openWB/optional/ep/grid_fee/provider"]?.name || null;
    },
    showLegend() {
      const flexibleTariffConfigured = this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/provider"]?.type;
      const gridFeeConfigured = this.$store.state.mqtt["openWB/optional/ep/grid_fee/provider"]?.type;
      return flexibleTariffConfigured && gridFeeConfigured;
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
    formatTickLabel(timeValue) {
      const date = new Date(timeValue);
      // Prüfe ob das Datum zum nächsten Tag gehört
      const isTomorrow = this.endOfToday < date;
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
