<template>
  <openwb-base-card
    v-if="electricityTariffConfigured"
    subtype="secondary"
    :collapsible="true"
    :collapsed="true"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'ranking-star']"
      />
      Variabler Stromtarif
    </template>
    <openwb-base-alert :subtype="statusLevel[$store.state.mqtt['openWB/optional/et/get/fault_state']]">
      <font-awesome-icon
        v-if="$store.state.mqtt['openWB/optional/et/get/fault_state'] == 1"
        fixed-width
        :icon="['fas', 'exclamation-triangle']"
      />
      <font-awesome-icon
        v-else-if="$store.state.mqtt['openWB/optional/et/get/fault_state'] == 2"
        fixed-width
        :icon="['fas', 'times-circle']"
      />
      <font-awesome-icon
        v-else
        fixed-width
        :icon="['fas', 'check-circle']"
      />
      Modulmeldung:<br />
      <span style="white-space: pre-wrap">{{ $store.state.mqtt["openWB/optional/et/get/fault_str"] }}</span>
    </openwb-base-alert>
    <openwb-base-text-input
      title="Anbieter"
      readonly
      :model-value="$store.state.mqtt['openWB/optional/et/provider'].name"
    />
    <div class="openwb-chart">
      <chartjs-line
        v-if="chartDataRead"
        ref="myChart"
        :data="chartDataObject"
        :options="chartOptions"
      />
    </div>
  </openwb-base-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle as fasCheckCircle,
  faExclamationTriangle as fasExclamationTriangle,
  faTimesCircle as fasTimesCircle,
  faRankingStar as fasRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasRankingStar);

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
  name: "ElectricityTariffCard",
  components: {
    ChartjsLine,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/optional/et/provider",
        "openWB/optional/et/get/fault_state",
        "openWB/optional/et/get/fault_str",
        "openWB/optional/et/get/prices",
      ],
      statusLevel: ["success", "warning", "danger"],
      chartDatasets: {
        datasets: [
          {
            label: "Stromtarif",
            unit: "ct/kWh",
            type: "line",
            stepped: true,
            borderColor: "rgba(255, 0, 0, 0.7)",
            backgroundColor: "rgba(255, 10, 13, 0.3)",
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
            display: false,
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
    electricityTariffConfigured() {
      const provider = this.$store.state.mqtt["openWB/optional/et/provider"];
      if (provider !== undefined) {
        return provider.type !== null;
      }
      return false;
    },
    chartDataRead() {
      return this.chartDataObject.datasets[0].data != undefined;
    },
    chartDataObject() {
      if (this.$store.state.mqtt["openWB/optional/et/get/prices"]) {
        var chartEntries = this.$store.state.mqtt["openWB/optional/et/get/prices"];
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
        // repeat last dataset with 59min 95sec offset
        const lastData = myData.slice(-1)[0];
        myData.push({
          timestamp: lastData.timestamp + (60 * 60 - 1) * 1000,
          price: lastData.price,
        });
      }
      const dataObject = this.chartDatasets;
      dataObject.datasets[0].data = myData;
      return dataObject;
    },
  },
};
</script>

<style scoped>
.openwb-chart {
  min-height: 250px;
}
</style>
