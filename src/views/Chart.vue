<template>
  <div class="chart">
    <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
      <openwb-base-alert subtype="info">
        Die Auswertungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet. Du
        findest alle Auswertungen in der openWB, welche sich im Steuerungsmodus "primary" befindet.
      </openwb-base-alert>
    </div>
    <div v-else>
      <openwb-base-card
        title="Filter"
        :collapsible="true"
        :collapsed="false"
      >
        <form name="chartFilterForm">
          <openwb-base-select-input
            v-model="chartRange"
            title="Zeitraum"
            :options="[
              { value: 'day', text: 'Tag' },
              { value: 'month', text: 'Monat' },
              { value: 'year', text: 'Jahr' },
            ]"
          />
          <openwb-base-text-input
            v-model="chartDate"
            :title="dateInput.title"
            :subtype="dateInput.type"
            :min="dateInput.min"
            :max="currentDate"
            :show-quick-buttons="true"
            @update:model-value="updateChart()"
          />
        </form>
      </openwb-base-card>
      <openwb-base-alert
        v-if="chartIsLoading"
        subtype="info"
      >
        Daten werden geladen...
      </openwb-base-alert>
      <div v-else>
        <openwb-base-alert
          v-if="!chartDataHasEntries"
          subtype="info"
        >
          Es konnten keine Daten für diesen Zeitraum gefunden werden.
        </openwb-base-alert>
        <div v-else>
          <openwb-base-card
            title="Diagramm"
            :collapsible="true"
            :collapsed="false"
          >
            <div class="openwb-chart">
              <chartjs-line
                ref="myChart"
                :data="chartData"
                :options="chartOptions"
                @click="handleChartClick"
              />
            </div>
          </openwb-base-card>
          <openwb-base-card
            title="Summen"
            :collapsible="true"
            :collapsed="true"
          >
            <form name="chartTotalsForm">
              <openwb-base-card
                v-for="(group, groupKey) in Object.fromEntries(
                  Object.entries(chartTotals).filter(([_, value]) => Object.keys(value).length > 0),
                )"
                :key="groupKey"
                :collapsible="true"
                :collapsed="true"
                :subtype="getCardSubtype(groupKey)"
              >
                <template #header>
                  <font-awesome-icon :icon="getCardIcon(groupKey)" />
                  {{ getTotalsLabel(groupKey) }}
                </template>
                <div
                  v-for="(component, componentKey) in group"
                  :key="componentKey"
                >
                  <openwb-base-heading v-if="groupKey !== 'hc'">
                    {{ getTotalsLabel(groupKey, componentKey) }}
                  </openwb-base-heading>
                  <div
                    v-for="(measurement, measurementKey) in component"
                    :key="measurementKey"
                  >
                    <openwb-base-text-input
                      :title="getTotalsLabel(groupKey, componentKey, measurementKey)"
                      readonly
                      class="text-right"
                      unit="kWh"
                      :model-value="formatNumber(measurement / 1000, 3)"
                    />
                  </div>
                  <hr v-if="componentKey == 'all' && groupKey != 'hc'" />
                </div>
              </openwb-base-card>
            </form>
          </openwb-base-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChargingStation as fasChargingStation,
  faCarBattery as fasCarBattery,
  faSolarPanel as fasSolarPanel,
  faGaugeHigh as fasGaugeHigh,
  faHouseSignal as fasHouseSignal,
  faHouse as fasHouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasChargingStation, fasCarBattery, fasSolarPanel, fasGaugeHigh, fasHouseSignal, fasHouse);

import ComponentState from "../components/mixins/ComponentState.vue";

import { Line as ChartjsLine, getElementAtEvent } from "vue-chartjs";
import "chartjs-adapter-luxon";
import "hammerjs";
import ZoomPlugin from "chartjs-plugin-zoom";
import {
  Chart,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  BarController,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  Filler,
} from "chart.js";
Chart.register(
  Tooltip,
  Legend,
  LineController,
  LineElement,
  BarController,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  Filler,
  ZoomPlugin,
);

export default {
  name: "OpenwbChartView",
  components: { ChartjsLine, FontAwesomeIcon },
  mixins: [ComponentState],
  props: {
    initialChartRange: {
      type: String,
      required: false,
      validator: function (value) {
        return ["day", "month", "year"].indexOf(value) !== -1;
      },
      default: "day",
    },
    initialDate: {
      type: String,
      required: false,
      validator: function (value) {
        return value.match(/^(([0-9]{4})(-[0-9]{2}(-[0-9]{2})?)?)?$/g);
      },
      default: "",
    },
  },
  emits: ["sendCommand"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/log/daily/#",
        "openWB/log/monthly/#",
        "openWB/log/yearly/#",
        "openWB/system/device/+/component/+/config",
        "openWB/chargepoint/+/config",
        "openWB/vehicle/+/name",
      ],
      currentDate: "",
      chartRange: "day",
      blockChartInit: false,
      chartIsLoading: false,
      chartRequestDate: {
        day: "",
        month: "",
        year: "",
      },
      datasetTemplates: {
        "counter-power_average": {
          label: "Zähler",
          unit: "kW",
          jsonKey: null,
          borderColor: "rgba(255, 0, 0, 0.7)",
          backgroundColor: "rgba(255, 10, 13, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: false,
          borderWidth: 1,
          data: null,
          yAxisID: "y",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "counter-energy_imported": {
          label: "Zähler",
          unit: "kWh",
          jsonKey: null,
          borderColor: "rgba(255, 0, 0, 0.7)",
          backgroundColor: "rgba(255, 10, 13, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: false,
          borderWidth: 1,
          data: null,
          yAxisID: "y2",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "counter-energy_exported": {
          label: "Zähler",
          unit: "kWh",
          jsonKey: null,
          borderColor: "rgba(0, 255, 105, 0.7)",
          backgroundColor: "rgba(0, 255, 255, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: false,
          borderWidth: 1,
          data: null,
          yAxisID: "y2",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "counter-energy_imported_grid": {
          label: "Zähler (Netzanteil)",
          unit: "kWh",
          type: "bar",
          jsonKey: null,
          borderColor: "rgba(255, 0, 0, 0.7)",
          backgroundColor: "rgba(255, 10, 13, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 3,
          data: null,
          yAxisID: "y2",
          stack: "#-energy-imported-source",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "counter-energy_imported_pv": {
          label: "Zähler (PV-Anteil)",
          unit: "kWh",
          type: "bar",
          jsonKey: null,
          borderColor: "rgba(40, 167, 69, 0.7)",
          backgroundColor: "rgba(255, 10, 13, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 3,
          data: null,
          yAxisID: "y2",
          stack: "#-energy-imported-source",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "counter-energy_imported_bat": {
          label: "Zähler (PV-Anteil)",
          unit: "kWh",
          type: "bar",
          jsonKey: null,
          borderColor: "rgba(253, 126, 20, 0.7)",
          backgroundColor: "rgba(255, 10, 13, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 3,
          data: null,
          yAxisID: "y2",
          stack: "#-energy-imported-source",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "pv-power_exported": {
          label: "PV",
          unit: "kW",
          jsonKey: null,
          borderColor: "rgba(40, 167, 69, 0.7)",
          backgroundColor: "rgba(10, 255, 13, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 1,
          data: null,
          yAxisID: "y",
          stack: "inverter-power",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "pv-energy_exported": {
          label: "PV",
          unit: "kWh",
          jsonKey: null,
          borderColor: "rgba(40, 167, 69, 0.7)",
          backgroundColor: "rgba(10, 255, 13, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 1,
          data: null,
          yAxisID: "y2",
          stack: "inverter-exported",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "bat-power_average": {
          label: "Speicher",
          unit: "kW",
          jsonKey: null,
          borderColor: "rgba(253, 126, 20, 0.7)",
          backgroundColor: "rgba(200, 255, 13, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 1,
          data: null,
          yAxisID: "y",
          stack: "battery-power",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "bat-energy_imported": {
          label: "Speicher",
          unit: "kWh",
          jsonKey: null,
          borderColor: "rgba(253, 126, 20, 0.7)",
          backgroundColor: "rgba(200, 255, 13, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 1,
          data: null,
          yAxisID: "y2",
          stack: "battery-imported",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "bat-energy_exported": {
          label: "Speicher",
          unit: "kWh",
          jsonKey: null,
          borderColor: "rgba(253, 126, 20, 0.7)",
          backgroundColor: "rgba(200, 255, 13, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 1,
          data: null,
          yAxisID: "y2",
          stack: "battery-exported",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "bat-soc": {
          label: "Speicher SoC",
          unit: "%",
          jsonKey: null,
          borderColor: "rgba(253, 126, 20, 0.7)",
          backgroundColor: "rgba(200, 255, 13, 0.3)",
          borderDash: [10, 5],
          hidden: true,
          fill: false,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          borderWidth: 2,
          data: null,
          yAxisID: "y3",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "cp-power_average": {
          label: "Ladepunkt",
          unit: "kW",
          jsonKey: null,
          borderColor: "#0000ff4c",
          backgroundColor: "#0000ff4c",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 1,
          data: null,
          yAxisID: "y",
          stack: "charge-point-power",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "cp-energy_imported": {
          label: "Ladepunkt",
          unit: "kWh",
          jsonKey: null,
          borderColor: "#0000ff4c",
          backgroundColor: "#0000ff4c",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 1,
          data: null,
          yAxisID: "y2",
          stack: "charge-point-imported",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "cp-energy_imported_grid": {
          label: "Ladepunkt (Netzanteil)",
          unit: "kWh",
          type: "bar",
          jsonKey: null,
          borderColor: "#dc3545b2",
          backgroundColor: "#0000ff4c",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 3,
          data: null,
          yAxisID: "y2",
          stack: "charge-point-imported-source",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "cp-energy_imported_pv": {
          label: "Ladepunkt (PV-Anteil)",
          unit: "kWh",
          type: "bar",
          jsonKey: null,
          borderColor: "#28a745b2",
          backgroundColor: "#0000ff4c",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 3,
          data: null,
          yAxisID: "y2",
          stack: "charge-point-imported-source",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "cp-energy_imported_bat": {
          label: "Ladepunkt (PV-Anteil)",
          unit: "kWh",
          type: "bar",
          jsonKey: null,
          borderColor: "#ffc107b2",
          backgroundColor: "#0000ff4c",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 3,
          data: null,
          yAxisID: "y2",
          stack: "charge-point-imported-source",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "ev-soc": {
          label: "Fahrzeug SoC",
          unit: "%",
          jsonKey: null,
          borderColor: "#17a2b8b2",
          backgroundColor: "#17a2b84c",
          borderDash: [10, 5],
          hidden: true,
          fill: false,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          borderWidth: 2,
          data: null,
          yAxisID: "y3",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "sh-power_average": {
          label: "SmartHome",
          unit: "kW",
          jsonKey: null,
          borderColor: "rgba(232, 62, 140, 0.7)",
          backgroundColor: "rgba(232, 72, 150, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: false,
          borderWidth: 1,
          data: null,
          yAxisID: "y",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "sh-energy_imported": {
          label: "SmartHome",
          unit: "kWh",
          jsonKey: null,
          borderColor: "rgba(232, 62, 140, 0.7)",
          backgroundColor: "rgba(232, 72, 150, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: false,
          borderWidth: 1,
          data: null,
          yAxisID: "y2",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "sh-energy_exported": {
          label: "SmartHome",
          unit: "kWh",
          jsonKey: null,
          borderColor: "rgba(232, 62, 140, 0.7)",
          backgroundColor: "rgba(232, 72, 150, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: false,
          borderWidth: 1,
          data: null,
          yAxisID: "y2",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "hc-power_imported": {
          label: "Hausverbrauch",
          unit: "kW",
          jsonKey: null,
          borderColor: "rgba(120, 122, 124, 0.7)",
          backgroundColor: "rgba(120, 122, 124, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 1,
          data: null,
          yAxisID: "y",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "hc-energy_imported": {
          label: "Hausverbrauch",
          unit: "kWh",
          jsonKey: null,
          borderColor: "rgba(120, 122, 124, 0.7)",
          backgroundColor: "rgba(120, 122, 124, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 1,
          data: null,
          yAxisID: "y2",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "hc-energy_imported_grid": {
          label: "Hausverbrauch (Netzanteil)",
          unit: "kWh",
          type: "bar",
          jsonKey: null,
          borderColor: "rgba(255, 0, 0, 0.7)",
          backgroundColor: "rgba(120, 122, 124, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 3,
          data: null,
          yAxisID: "y2",
          stack: "hc-energy-imported-source",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "hc-energy_imported_pv": {
          label: "Hausverbrauch (PV-Anteil)",
          unit: "kWh",
          type: "bar",
          jsonKey: null,
          borderColor: "rgba(40, 167, 69, 0.7)",
          backgroundColor: "rgba(120, 122, 124, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 3,
          data: null,
          yAxisID: "y2",
          stack: "hc-energy-imported-source",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
        "hc-energy_imported_bat": {
          label: "Hausverbrauch (PV-Anteil)",
          unit: "kWh",
          type: "bar",
          jsonKey: null,
          borderColor: "rgba(253, 126, 20, 0.7)",
          backgroundColor: "rgba(120, 122, 124, 0.3)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 0,
          pointHoverRadius: 4,
          cubicInterpolationMode: "monotone",
          hidden: true,
          borderWidth: 3,
          data: null,
          yAxisID: "y2",
          stack: "hc-energy-imported-source",
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: null,
          },
        },
      },
      chartOptions: {
        plugins: {
          title: {
            display: false,
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (item) => `${item.dataset.label}: ${item.formattedValue} ${item.dataset.unit}`,
            },
          },
          legend: {
            display: true,
          },
          zoom: {
            // Container for pan options
            pan: {
              // Boolean to enable panning
              enabled: true,
              // Panning directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow panning in the y direction
              mode: "x",
              threshold: 5,
            },
            // Container for zoom options
            zoom: {
              // Boolean to enable zooming
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              // Zooming directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow zooming in the y direction
              mode: "x",
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
              unit: "",
              tooltipFormat: "",
            },
            display: true,
            title: {
              display: true,
              text: "",
            },
            ticks: {
              source: "timestamp",
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
            // left side (power, kW)
            position: "left",
            type: "linear",
            display: "auto",
            suggestedMin: 0,
            suggestedMax: 0,
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
              stepSize: 0.2,
              maxTicksLimit: 11,
              // color: tickColor
            },
          },
          y2: {
            // left side (energy, kWh)
            position: "left",
            type: "linear",
            display: "auto",
            suggestedMin: 0,
            suggestedMax: 0,
            title: {
              font: {
                size: 12,
              },
              display: true,
              text: "Energie [kWh]",
              // color: fontColor
            },
            grid: {
              // color: gridColor
            },
            ticks: {
              font: {
                size: 12,
              },
              stepSize: 0.2,
              maxTicksLimit: 11,
              // color: tickColor
            },
          },
          y3: {
            // right side (SoC, %)
            position: "right",
            type: "linear",
            display: "auto",
            suggestedMin: 0,
            suggestedMax: 100,
            title: {
              font: {
                size: 12,
              },
              display: true,
              text: "SoC [%]",
              // color: fontColor
            },
            grid: {
              display: false,
              // color: gridSocColor,
            },
            ticks: {
              font: {
                size: 12,
              },
              stepSize: 10,
              maxTicksLimit: 11,
              // color: tickColor
            },
          },
        },
      },
      chartDatasets: {
        datasets: [],
      },
    };
  },
  computed: {
    dateInput() {
      var dateObject = {
        title: "Datum",
        type: "date",
        min: "2018-01-01",
      };
      switch (this.chartRange) {
        case "month":
          dateObject = {
            title: "Monat",
            type: "month",
            min: "2018-01",
          };
          break;
        case "year":
          dateObject = {
            title: "Jahr",
            type: "year",
            min: "2018",
          };
          break;
      }
      return dateObject;
    },
    chartDate: {
      get() {
        var dateString = this.chartRequestDate.year;
        if (this.chartRange != "year") {
          dateString = dateString + "-" + this.chartRequestDate.month;
        }
        if (this.chartRange == "day") {
          dateString = dateString + "-" + this.chartRequestDate.day;
        }
        return dateString;
      },
      set(newValue) {
        let splitDate = newValue.split("-");
        this.chartRequestDate.year = splitDate[0];
        if (splitDate.length > 1) {
          this.chartRequestDate.month = splitDate[1];
        } else {
          this.chartRequestDate.month = "";
        }
        if (splitDate.length > 2) {
          this.chartRequestDate.day = splitDate[2];
        } else {
          this.chartRequestDate.day = "";
        }
      },
    },
    chartScaleX() {
      var scaleObject = {
        unit: "minute",
        tooltipFormat: "DD T",
        text: "Zeit",
        maxTicksLimit: 24,
      };
      switch (this.chartRange) {
        case "month":
          scaleObject = {
            unit: "day",
            tooltipFormat: "DD",
            text: "Tag",
            maxTicksLimit: 31,
          };
          break;
        case "year":
          scaleObject = {
            unit: "month",
            tooltipFormat: "LLLL yyyy",
            text: "Monat",
            maxTicksLimit: 12,
          };
          break;
      }
      return scaleObject;
    },
    commandData() {
      var dataObject = {
        date: this.chartRequestDate.year + this.chartRequestDate.month + this.chartRequestDate.day,
      };
      switch (this.chartRange) {
        case "month":
          dataObject = {
            date: this.chartRequestDate.year + this.chartRequestDate.month,
          };
          break;
        case "year":
          dataObject = {
            date: this.chartRequestDate.year,
          };
          break;
      }
      return dataObject;
    },
    baseTopic() {
      var topic = "openWB/log/";
      switch (this.chartRange) {
        case "day":
          topic = topic + "daily/";
          break;
        case "month":
          topic = topic + "monthly/";
          break;
        case "year":
          topic = topic + "yearly/";
          break;
      }
      return topic;
    },
    chartDataRead() {
      return this.chartDataObject != undefined;
    },
    chartDataHasEntries() {
      if (this.chartDataObject) {
        return this.chartDataObject.length > 0;
      }
      return false;
    },
    chartTotals() {
      if (this.$store.state.mqtt[this.baseTopic + this.commandData.date]) {
        if (
          Object.prototype.hasOwnProperty.call(this.$store.state.mqtt[this.baseTopic + this.commandData.date], "totals")
        ) {
          var totals = JSON.parse(
            JSON.stringify(this.$store.state.mqtt[this.baseTopic + this.commandData.date].totals),
          );
          // remove not relevant data for easier parsing
          delete totals.energy_source;
          Object.keys(totals.counter).forEach((component) => {
            if (Object.prototype.hasOwnProperty.call(totals.counter[component], "grid")) {
              delete totals.counter[component].grid;
            }
          });
          // check if "all" key is present and necessary
          Object.keys(totals).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(totals[key], "all")) {
              // delete key "all" if we only have one component of type "bat" or "pv"
              if (Object.keys(totals[key]).length <= 2 && ["bat", "pv"].includes(key)) {
                delete totals[key].all;
              } else {
                // move key "all" to the beginning
                totals[key] = {
                  all: totals[key].all,
                  ...totals[key],
                };
              }
            }
          });
          return totals;
        }
      }
      return undefined;
    },
    chartDataObject() {
      if (this.$store.state.mqtt[this.baseTopic + this.commandData.date]) {
        var chartEntries = this.$store.state.mqtt[this.baseTopic + this.commandData.date];
        if (Object.prototype.hasOwnProperty.call(chartEntries, "entries")) {
          chartEntries = chartEntries.entries;
        }
        var myData = JSON.parse(JSON.stringify(chartEntries)).map((row) => {
          row.timestamp = row.timestamp * 1000;
          return row;
        });
        return myData;
      }
      return undefined;
    },
    chartData() {
      if (this.chartDataObject) {
        var baseObjectsToProcess = ["pv", "counter", "bat", "cp", "sh", "ev", "hc"];
        const lastElement = this.chartDataObject[this.chartDataObject.length - 1];
        if (lastElement) {
          baseObjectsToProcess.forEach((baseObject) => {
            if (Object.prototype.hasOwnProperty.call(lastElement, baseObject)) {
              if (Object.prototype.hasOwnProperty.call(lastElement[baseObject], "all")) {
                // remove "all" key if we only have one component of type "bat" or "pv"
                if (["bat", "pv"].includes(baseObject) && Object.keys(lastElement[baseObject]).length <= 2) {
                  delete lastElement[baseObject].all;
                } else {
                  // move "all" key to the beginning
                  lastElement[baseObject] = {
                    all: lastElement[baseObject].all,
                    ...lastElement[baseObject],
                  };
                }
              }
              // add all datasets available in the last entry
              Object.entries(lastElement[baseObject]).forEach(([key, value]) => {
                Object.keys(value).forEach((entryKey) => {
                  this.initDataset(baseObject, key, entryKey);
                });
              });
            }
          });
        }
        return this.chartDatasets;
      }
      return undefined;
    },
  },
  watch: {
    chartRange() {
      this.init();
    },
    chartDataRead: {
      handler(newValue) {
        if (newValue) {
          this.chartIsLoading = false;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    handleChartClick(event) {
      if (this.chartRange == "day") {
        // no click actions for daily charts
        return;
      }
      const chart = this.$refs.myChart.chart;
      if (!chart) {
        return;
      }
      const element = getElementAtEvent(chart, event);
      if (!element.length) {
        return;
      }
      const { datasetIndex, index } = element[0];
      const clickedDate = this.chartData.datasets[datasetIndex].data[index].date;
      var newDate = "";
      var newRange = "";
      switch (this.chartRange) {
        case "month":
          newDate = clickedDate.substring(0, 4) + "-" + clickedDate.substring(4, 6) + "-" + clickedDate.substring(6);
          newRange = "day";
          break;
        case "year":
          newDate = clickedDate.substring(0, 4) + "-" + clickedDate.substring(4, 6);
          newRange = "month";
          break;
      }
      // prevent setting default date for new range
      this.blockChartInit = true;
      this.chartDate = newDate;
      this.chartRange = newRange;
    },
    /**
     * Returns the card subtype based on the given element key.
     * @param {string} elementKey - The key of the element.
     * @returns {string} - The card subtype.
     */
    getCardSubtype(elementKey) {
      switch (elementKey) {
        case "bat":
          return "warning";
        case "counter":
          return "danger";
        case "cp":
          return "primary";
        case "pv":
          return "success";
        case "sh":
          return "pink";
        default:
          return "secondary";
      }
    },
    /**
     * Returns the icon for a given element key.
     * @param {string} elementKey - The key of the element.
     * @returns {Array<string>|undefined} - The icon as an array of strings representing the icon class.
     * If the element key is not recognized, undefined is returned.
     */
    getCardIcon(elementKey) {
      switch (elementKey) {
        case "bat":
          return ["fas", "car-battery"];
        case "counter":
          return ["fas", "gauge-high"];
        case "cp":
          return ["fas", "charging-station"];
        case "pv":
          return ["fas", "solar-panel"];
        case "sh":
          return ["fas", "house-signal"];
        case "hc":
          return ["fas", "house"];
        default:
          return undefined;
      }
    },
    /**
     * Hides a dataset in the chart.
     *
     * @param {Object} baseObject - The base object containing the dataset.
     * @param {string} objectKey - The key of the dataset to hide.
     * @param {string} elementKey - The key of the element.
     * @returns {boolean} - True if the dataset should be hidden, false otherwise.
     */
    hideDataset(baseObject, objectKey, elementKey) {
      // if dataset "all" is present, hide component datasets
      if (["bat", "pv", "cp"].includes(baseObject)) {
        if (Object.prototype.hasOwnProperty.call(this.chartTotals[baseObject], "all") && objectKey != "all") {
          return true;
        }
      }
      // if elementKey ends with "grid", "bat", "pv" or "cp", hide the dataset
      if (["grid", "bat", "pv", "cp"].includes(elementKey.split("_").pop())) {
        return true;
      }
      return false;
    },
    /**
     * Returns the label for the totals.
     *
     * @param {string} groupKey - The key of the group.
     * @param {string} componentKey - The key of the component.
     * @param {string} measurementKey - The key of the measurement.
     * @returns {string} The label for the totals.
     */
    getTotalsLabel(groupKey, componentKey = undefined, measurementKey = undefined) {
      var label = "*test*";
      if (!componentKey && !measurementKey) {
        switch (groupKey) {
          case "bat":
            return "Speicher";
          case "counter":
            return "Zähler";
          case "pv":
            return "Wechselrichter";
          case "cp":
            return "Ladepunkte";
          case "sh":
            return "SmartHome-Geräte";
          case "hc":
            return "Hausverbrauch";
          default:
            console.warn("unknown group key:", groupKey);
        }
        return "*" + groupKey + "*";
      }
      if (componentKey && !measurementKey) {
        if (componentKey == "all") {
          return "Summe";
        } else {
          if (
            Object.prototype.hasOwnProperty.call(
              this.$store.state.mqtt[this.baseTopic + this.commandData.date],
              "names",
            )
          ) {
            return this.$store.state.mqtt[this.baseTopic + this.commandData.date].names[componentKey];
          }
        }
      }
      if (componentKey && measurementKey) {
        switch (groupKey) {
          case "bat":
          case "cp":
            switch (measurementKey) {
              case "imported":
              case "energy_imported":
                return "Ladung";
              case "exported":
              case "energy_exported":
                return "Entladung";
              case "energy_imported_grid":
                return "Ladung (Netz-Anteil)";
              case "energy_imported_pv":
                return "Ladung (PV-Anteil)";
              case "energy_imported_bat":
                return "Ladung (Speicher-Anteil)";
              case "energy_imported_cp":
                return "Ladung (Ladepunkt-Anteil)";
              default:
                console.warn("unknown measurement key:", groupKey, measurementKey);
            }
            break;
          case "counter":
            switch (measurementKey) {
              case "imported":
              case "energy_imported":
                return "Bezug/Verbrauch";
              case "exported":
              case "energy_exported":
                return "Einspeisung/Erzeugung";
              case "energy_imported_grid":
                return "Verbrauch (Netz-Anteil)";
              case "energy_imported_pv":
                return "Verbrauch (PV-Anteil)";
              case "energy_imported_bat":
                return "Verbrauch (Speicher-Anteil)";
              case "energy_imported_cp":
                return "Verbrauch (Ladepunkt-Anteil)";
              default:
                console.warn("unknown measurement key:", groupKey, measurementKey);
            }
            break;
          case "pv":
            switch (measurementKey) {
              case "exported":
              case "energy_exported":
                return "Erzeugung";
              default:
                console.warn("unknown measurement key:", groupKey, measurementKey);
            }
            break;
          case "sh":
            switch (measurementKey) {
              case "imported":
              case "energy_imported":
                return "Verbrauch";
              case "exported":
              case "energy_exported":
                return "Erzeugung";
              default:
                console.warn("unknown measurement key:", groupKey, measurementKey);
            }
            break;
          case "hc":
            switch (measurementKey) {
              case "imported":
              case "energy_imported":
                return "Verbrauch";
              case "energy_imported_grid":
                return "Verbrauch (Netz-Anteil)";
              case "energy_imported_pv":
                return "Verbrauch (PV-Anteil)";
              case "energy_imported_bat":
                return "Verbrauch (Speicher-Anteil)";
              case "energy_imported_cp":
                return "Verbrauch (Ladepunkt-Anteil)";
              default:
                console.warn("unknown measurement key:", groupKey, measurementKey);
            }
            break;
          default:
            console.warn("unknown group key:", groupKey);
        }
        return "*" + groupKey + "+" + componentKey + "+" + measurementKey + "*";
      }
      return label;
    },
    /**
     * Builds a label string
     * @param {String} baseObject
     * @param {String} objectKey
     * @param {String} elementKey
     * @param {String} datasetKey
     * @returns {String}
     */
    getDatasetLabel(baseObject, objectKey, elementKey, datasetKey) {
      var label = ["*" + datasetKey];
      var details = [];
      if (objectKey == "all") {
        if (baseObject !== "hc") {
          details.push("Summe");
        }
        switch (baseObject) {
          case "pv":
            label = ["PV"];
            break;
          case "bat":
            label = ["Speicher"];
            switch (elementKey) {
              case "soc":
                label.push("SoC");
                break;
            }
            break;
          case "cp":
            label = ["Ladepunkte"];
            break;
          case "hc":
            label = ["Hausverbrauch"];
        }
      } else {
        if (
          Object.prototype.hasOwnProperty.call(
            this.$store.state.mqtt[this.baseTopic + this.commandData.date],
            "names",
          ) &&
          Object.prototype.hasOwnProperty.call(
            this.$store.state.mqtt[this.baseTopic + this.commandData.date].names,
            objectKey,
          )
        ) {
          label = [this.$store.state.mqtt[this.baseTopic + this.commandData.date].names[objectKey]];
        }
      }
      switch (baseObject) {
        case "bat":
        case "ev":
        case "cp":
          switch (elementKey) {
            case "soc":
              details.push("SoC");
              break;
            case "energy_imported":
              details.push("Ladung");
              break;
            case "energy_exported":
              details.push("Entladung");
              break;
            case "energy_imported_grid":
              details.push("Netz-Anteil");
              break;
            case "energy_imported_pv":
              details.push("PV-Anteil");
              break;
            case "energy_imported_bat":
              details.push("Speicher-Anteil");
              break;
            case "energy_imported_cp":
              details.push("Ladepunkt-Anteil");
              break;
          }
          break;
        case "counter":
          switch (elementKey) {
            case "energy_imported":
              details.push("Bezug/Verbrauch");
              break;
            case "energy_exported":
              details.push("Einspeisung/Erzeugung");
              break;
            case "energy_imported_grid":
              details.push("Netz-Anteil");
              break;
            case "energy_imported_pv":
              details.push("PV-Anteil");
              break;
            case "energy_imported_bat":
              details.push("Speicher-Anteil");
              break;
            case "energy_imported_cp":
              details.push("Ladepunkt-Anteil");
              break;
          }
          break;
        case "sh":
          switch (elementKey) {
            case "energy_imported":
              details.push("Verbrauch");
              break;
            case "energy_exported":
              details.push("Erzeugung");
              break;
          }
          break;
        case "hc":
          switch (elementKey) {
            case "energy_imported_grid":
              details.push("Netz-Anteil");
              break;
            case "energy_imported_pv":
              details.push("PV-Anteil");
              break;
            case "energy_imported_bat":
              details.push("Speicher-Anteil");
              break;
            case "energy_imported_cp":
              details.push("Ladepunkt-Anteil");
              break;
          }
          break;
      }
      return `${label.join(" ")}${details.length ? " (" + details.join(", ") + ")" : ""}`;
    },
    /**
     * Returns the color for a dataset based on the base object, object key, and element key.
     * @param {String} baseObject
     * @param {String} objectKey
     * @param {String} elementKey
     * @param {String} datasetKey
     * @returns {Object|undefined} - An object containing borderColor and backgroundColor, or undefined if no color is found.
     */
    getDatasetColor(baseObject, objectKey, elementKey, datasetKey) {
      const elementIsImported = elementKey.includes("imported");
      let color,
        negativeColor = undefined;
      if (
        Object.prototype.hasOwnProperty.call(
          this.$store.state.mqtt[this.baseTopic + this.commandData.date],
          "colors",
        ) &&
        Object.prototype.hasOwnProperty.call(
          this.$store.state.mqtt[this.baseTopic + this.commandData.date].colors,
          objectKey,
        )
      ) {
        color = this.$store.state.mqtt[this.baseTopic + this.commandData.date].colors[objectKey].color;
        negativeColor = this.$store.state.mqtt[this.baseTopic + this.commandData.date].colors[objectKey].negativeColor;
      }
      console.log("getDatasetColor:", baseObject, objectKey, elementKey, datasetKey, color, negativeColor);
      return color
        ? {
            borderColor: `${elementIsImported && negativeColor ? negativeColor : color}b2`,
            backgroundColor: `${elementIsImported && negativeColor ? negativeColor : color}4c`,
          }
        : undefined;
    },
    /**
     * Returns the index of the dataset with the specified dataset key.
     *
     * @param {string} datasetKey - The key of the dataset to find.
     * @returns {number|undefined} - The index of the dataset if found, otherwise undefined.
     */
    getDatasetIndex(datasetKey) {
      let index = this.chartDatasets.datasets.findIndex((dataset) => {
        return dataset.jsonKey == datasetKey;
      });
      if (index != -1) {
        return index;
      }
      return;
    },
    /**
     * Updates the stack of a dataset based on the provided stack, object key and element key.
     *
     * @param {string} stack - The current stack of the dataset.
     * @param {string} objectKey - The key of the object to update the stack for.
     * @param {string} elementKey - The key of the element to update the stack for.
     * @returns {string} - The updated stack string.
     */
    updateDatasetStack(stack, objectKey, elementKey) {
      // if stack is not defined, return undefined
      if (!stack) {
        return undefined;
      }
      // do not stack totals
      if (objectKey == "all" && !["grid", "pv", "bat", "cp"].includes(elementKey.split("_").slice(-1)[0])) {
        console.debug("not stacking totals for:", stack, objectKey, elementKey);
        return undefined;
      }
      // if stack is a template, replace # with objectKey
      if (stack.includes("#")) {
        console.debug("updating stack template:", stack, objectKey, elementKey);
        return stack.replace("#", objectKey);
      }
      // otherwise return the stack as is
      return stack;
    },
    /**
     * Adds a dataset to the chart.
     *
     * @param {string} baseObject - The base object for the dataset.
     * @param {string} objectKey - The object key for the dataset.
     * @param {string} elementKey - The element key for the dataset.
     * @param {string} datasetKey - The dataset key.
     * @returns {number|undefined} - The index of the added dataset or undefined if no dataset was added.
     */
    addDataset(baseObject, objectKey, elementKey, datasetKey) {
      console.debug("adding dataset:", baseObject, objectKey, elementKey, datasetKey);
      // do not add dataset if objectKey is not present in totals[baseObject]
      if (
        Object.prototype.hasOwnProperty.call(this.chartTotals, baseObject) &&
        !Object.prototype.hasOwnProperty.call(this.chartTotals[baseObject], objectKey)
      ) {
        return;
      }
      var datasetTemplate = baseObject + "-" + elementKey;
      if (this.datasetTemplates[datasetTemplate]) {
        var newDataset = JSON.parse(JSON.stringify(this.datasetTemplates[datasetTemplate]));
        newDataset.parsing.yAxisKey = datasetKey;
        newDataset.jsonKey = datasetKey;
        newDataset.data = this.chartDataObject;
        // build dataset label
        newDataset.label = this.getDatasetLabel(baseObject, objectKey, elementKey, datasetKey);
        if (newDataset.labelSuffix != undefined) {
          newDataset.label = newDataset.label + newDataset.labelSuffix;
        }
        newDataset.hidden = this.hideDataset(baseObject, objectKey, elementKey);
        newDataset.stack = this.updateDatasetStack(newDataset.stack, objectKey, elementKey);
        const colors = this.getDatasetColor(baseObject, objectKey, elementKey, datasetKey);
        console.log("dataset color", colors);
        if (colors) {
          newDataset.borderColor = colors.borderColor;
          newDataset.backgroundColor = colors.backgroundColor;
        }
        return this.chartDatasets.datasets.push(newDataset) - 1;
      } else {
        console.warn("no matching template found for: " + datasetKey + " with template: " + datasetTemplate);
      }
      return;
    },
    /**
     * Initializes a dataset based on the provided parameters.
     *
     * @param {string} baseObject - The base object of the dataset.
     * @param {string} objectKey - The object key of the dataset.
     * @param {string} elementKey - The element key of the dataset.
     */
    initDataset(baseObject, objectKey, elementKey) {
      var elementKeysToAdd = [];
      if (this.chartRange == "day") {
        elementKeysToAdd = {
          counter: ["power_average"],
          pv: ["power_exported"],
          bat: ["power_average", "soc"],
          cp: ["power_average"],
          sh: ["power_average"],
          ev: ["soc"],
          hc: ["power_imported"],
        };
      } else {
        elementKeysToAdd = {
          counter: [
            "energy_imported",
            "energy_exported",
            "energy_imported_grid",
            "energy_imported_pv",
            "energy_imported_bat",
          ],
          pv: ["energy_exported"],
          bat: ["energy_imported", "energy_exported"],
          cp: ["energy_imported", "energy_imported_grid", "energy_imported_pv", "energy_imported_bat"],
          sh: ["energy_imported", "energy_exported"],
          ev: [],
          hc: ["energy_imported", "energy_imported_grid", "energy_imported_pv", "energy_imported_bat"],
        };
      }
      const datasetKey = baseObject + "." + objectKey + "." + elementKey;
      if (elementKeysToAdd[baseObject].includes(elementKey)) {
        var index = this.getDatasetIndex(datasetKey);
        if (index == undefined) {
          index = this.addDataset(baseObject, objectKey, elementKey, datasetKey);
        }
      } else {
        console.debug("skipping dataset:", datasetKey);
      }
    },
    /**
     * Sets up the X scale for the chart.
     * Updates the chart options with the specified X scale properties.
     */
    setupScaleX() {
      this.chartOptions.scales.x.time.unit = this.chartScaleX.unit;
      this.chartOptions.scales.x.time.tooltipFormat = this.chartScaleX.tooltipFormat;
      this.chartOptions.scales.x.title.text = this.chartScaleX.text;
      this.chartOptions.scales.x.ticks.maxTicksLimit = this.chartScaleX.maxTicksLimit;
    },
    /**
     * Requests chart data based on the selected chart range.
     * If the chart form is invalid, a warning is logged and the function returns.
     */
    requestChart() {
      let myForm = document.forms["chartFilterForm"];
      if (!myForm.reportValidity()) {
        console.warn("form invalid");
        return;
      } else {
        this.chartIsLoading = true;
        this.setupScaleX();
        this.chartDatasets.datasets = [];
        var command = "";
        switch (this.chartRange) {
          case "day":
            command = "getDailyLog";
            break;
          case "month":
            command = "getMonthlyLog";
            break;
          case "year":
            command = "getYearlyLog";
            break;
        }
        this.$emit("sendCommand", {
          command: command,
          data: this.commandData,
        });
      }
    },
    /**
     * Clears the chart data by removing all topics that match the wildcard pattern.
     * Then, it commits the "removeTopic" mutation for each topic in the list.
     */
    clearChartData() {
      this.getWildcardIndexList(this.baseTopic + "+").forEach((topic) => {
        this.$store.commit("removeTopic", `${this.baseTopic}${topic}`);
      });
    },
    /**
     * Updates the chart by clearing the chart data and then requesting new chart data.
     */
    updateChart() {
      this.clearChartData();
      this.requestChart();
    },
    /**
     * Initializes the chart by setting the current date and chart date based on the chart range and initial date.
     */
    init() {
      const today = new Date();
      this.currentDate = String(today.getFullYear());
      if (this.chartRange != "year") {
        this.currentDate = this.currentDate + "-" + String(today.getMonth() + 1).padStart(2, "0");
      }
      if (this.chartRange == "day") {
        this.currentDate = this.currentDate + "-" + String(today.getDate()).padStart(2, "0");
      }
      if (!this.blockChartInit) {
        if (this.initialDate == undefined || this.initialDate == "") {
          this.chartDate = this.currentDate;
        } else {
          this.chartDate = this.initialDate;
        }
      } else {
        this.blockChartInit = false;
      }
      this.updateChart();
    },
  },
};
</script>

<style scoped>
.openwb-chart {
  min-height: 400px;
}
</style>
