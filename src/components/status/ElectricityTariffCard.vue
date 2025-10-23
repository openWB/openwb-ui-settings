<template>
  <status-card
    v-if="electricityTariffConfigured"
    subtype="secondary"
    :state="$store.state.mqtt[baseTopic + '/get/fault_state']"
    :state-message="$store.state.mqtt[baseTopic + '/get/fault_str']"
  >
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'ranking-star']" />
      Variabler Stromtarif
    </template>
    <template #header-right>{{ currentPrice }}&nbsp;ct/kWh</template>
    <openwb-base-card
      :title="'Anbieter: ' + $store.state.mqtt[baseTopic + '/provider'].name"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="openwb-chart">
        <chartjs-line
          v-if="chartDataRead"
          ref="myChart"
          :data="chartDataObject"
          :options="chartOptions"
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
  name: "ElectricityTariffCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
    ChartjsLine,
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
              callback: function(value, index, values) {
                const date = new Date(value);
                const currentDate = new Date();
                
                // Prüfe ob das Datum zum nächsten Tag gehört
                const isTomorrow = 
                  date.getDate() === currentDate.getDate() + 1 && 
                  date.getMonth() === currentDate.getMonth() &&
                  date.getFullYear() === currentDate.getFullYear();
                  
                // Zeige nur den Zeitwert, wenn es nicht morgen ist
                return "${isTomorrow ? 'morgen ' : ''}${this.getLabelForValue(value)}";
              }
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
        // repeat last dataset until midnight
        const lastData = myData.slice(-1)[0];
        if (myData.length >= 2) {
          // repeat last dataset with same offset as the last one
          const previousData = myData.slice(-2, -1)[0];
          lastData.timestamp += lastData.timestamp - previousData.timestamp;
        } else {
          // fallback to midnight
          lastData.timestamp = new Date(lastData.timestamp).setHours(23, 59, 59, 999).getTime();
        }
        myData.push({
          timestamp: lastData.timestamp,          price: lastData.price,
        });
      }
      const dataObject = this.chartDatasets;
      dataObject.datasets[0].data = myData;
      return dataObject;
    },
    currentPrice() {
      if (this.chartDataObject.datasets[0].data === undefined || this.chartDataObject.datasets[0].data.length === 0) {
        return this.formatNumber(0, 2);
      }
      return this.formatNumber(this.chartDataObject.datasets[0].data[0].price || 0, 2);
    },
    baseTopic: {
      get() {
        return "openWB/optional/et";
      },
    },
  },
};
</script>

<style scoped>
.openwb-chart {
  min-height: 250px;
}
</style>
