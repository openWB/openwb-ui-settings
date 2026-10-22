<template>
  <div class="openwb-time-series-chart">
    <chartjs-line
      v-if="chartDataRead"
      :data="chartDataObject"
      :options="dynamicChartOptions"
    />
  </div>
</template>

<script>
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
  name: "OpenwbTimeSeriesChart",
  components: {
    ChartjsLine,
  },
  props: {
    // Each entry: { label, color, backgroundColor, fill, stepped, tension, borderWidth, unit, data }
    // data is an array of { timestamp (ms), value } points, already day-filtered/scaled by the caller.
    datasets: { type: Array, required: true },
    yAxisLabel: { type: String, required: true },
    zoomable: { type: Boolean, default: false },
    showLegend: { type: Boolean, default: true },
    minHeight: { type: Number, default: 250 },
    yAxisStepSize: { type: Number, default: undefined },
    // Number of decimal places shown in tooltips; undefined shows the raw, unrounded value.
    tooltipDecimals: { type: Number, default: undefined },
    // Extends the last point of each dataset by the interval of the previous two entries,
    // so the line doesn't visually stop mid-chart when no further data exists yet. Falls
    // back to the end of the current day only when a dataset has a single point.
    extendLastInterval: { type: Boolean, default: true },
  },
  computed: {
    chartDataObject() {
      return {
        datasets: this.datasets.map((dataset) => {
          const data = this.extendLastInterval ? this.padLastInterval(dataset.data) : dataset.data || [];
          return {
            label: dataset.label,
            unit: dataset.unit,
            type: "line",
            stepped: dataset.stepped || false,
            tension: dataset.tension ?? 0,
            fill: dataset.fill ?? false,
            borderColor: dataset.color,
            backgroundColor: dataset.backgroundColor || dataset.color,
            pointStyle: "circle",
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: dataset.borderWidth ?? 1,
            hidden: data.length === 0,
            data,
            yAxisID: "y",
            parsing: { xAxisKey: "timestamp", yAxisKey: "value" },
          };
        }),
      };
    },
    chartDataRead() {
      return this.chartDataObject.datasets.some((dataset) => dataset.data.length > 0 && !dataset.hidden);
    },
    dynamicChartOptions() {
      return {
        plugins: {
          title: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const unit = context.dataset.unit ? ` ${context.dataset.unit}` : "";
                const value =
                  this.tooltipDecimals === undefined
                    ? context.parsed.y
                    : context.parsed.y?.toFixed(this.tooltipDecimals);
                return `${context.dataset.label}: ${value}${unit}`;
              },
            },
          },
          legend: {
            display: this.showLegend,
            position: "top",
            labels: {
              filter: (legendItem, chartData) => !chartData.datasets[legendItem.datasetIndex].hidden,
            },
          },
          zoom: this.zoomable
            ? {
                pan: { enabled: true, mode: "x" },
                zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" },
              }
            : undefined,
        },
        elements: { point: { radius: 2 } },
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: {
          x: {
            type: "time",
            time: { unit: "hour", maxTicksLimit: 24 },
            display: true,
            title: { display: true, text: "Uhrzeit" },
            ticks: { font: { size: 12 }, callback: this.formatTickLabel, maxTicksLimit: 0 },
          },
          y: {
            position: "left",
            type: "linear",
            display: "auto",
            title: { font: { size: 12 }, display: true, text: this.yAxisLabel },
            ticks: { font: { size: 12 }, maxTicksLimit: 11, stepSize: this.yAxisStepSize },
          },
        },
      };
    },
  },
  methods: {
    getEndOfToday() {
      return new Date().setHours(23, 59, 59, 999).valueOf();
    },
    formatTickLabel(timeValue) {
      const date = new Date(timeValue);
      const isTomorrow = this.getEndOfToday() < date;
      let label = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      if (isTomorrow) {
        label = date.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" }) + " " + label;
      }
      return label;
    },
    padLastInterval(data) {
      if (!Array.isArray(data) || data.length === 0) {
        return data || [];
      }
      const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
      const lastEntry = sorted[sorted.length - 1];
      let nextTimestamp = this.getEndOfToday();
      if (sorted.length > 1) {
        const previousEntry = sorted[sorted.length - 2];
        nextTimestamp = lastEntry.timestamp + lastEntry.timestamp - previousEntry.timestamp - 1;
      }
      return [...sorted, { timestamp: nextTimestamp, value: lastEntry.value }];
    },
  },
};
</script>

<style scoped>
.openwb-time-series-chart {
  min-height: v-bind("minHeight + 'px'");
}
</style>
