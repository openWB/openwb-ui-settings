<template>
  <LegendStandard
    v-if="showStandardLegend"
    :key="range"
    :items="legendItems"
    @toggle="toggleDataset"
  />
  <LegendCategoriesGroup
    v-else
    :categorized-items="categorizedLegendItems"
    @toggle="toggleDataset"
  />
</template>
<script>
import LegendStandard from "./LegendStandard.vue";
import LegendCategoriesGroup from "./LegendCategoriesGroup.vue";

export default {
  name: "ChartLegend",
  components: { LegendCategoriesGroup, LegendStandard },
  props: {
    chart: {
      type: Object,
      default: () => null,
    },
    range: {
      type: String,
      default: "day",
    },
  },
  computed: {
    legendItems() {
      if (!this.chart || !this.chart.data) {
        return [];
      }
      const hidden = this.$store.state.chartLegend.hiddenDatasets;
      return this.chart.data.datasets.map((dataset, index) => ({
        label: dataset.label,
        index,
        category: dataset.category || "component",
        hidden: hidden.includes(dataset.label),
        borderColor: dataset.borderColor,
        borderDash: dataset.borderDash,
      }));
    },
    categorizedLegendItems() {
      if (!this.chart) {
        return { chargepoint: [], vehicle: [], component: [] };
      }
      let categories = {};
      const hidden = this.$store.state.chartLegend.hiddenDatasets;
      if (this.range === "day") {
        categories = { chargepoint: [], vehicle: [], component: [] };
      } else {
        categories = { chargepoint: [], component: [] };
      }
      const datasets = this.chart?.data?.datasets || [];
      datasets.forEach((dataset, index) => {
        const category = dataset.category || "component";
        if (!categories[category]) categories[category] = [];
        categories[category].push({
          label: dataset.label,
          index,
          hidden: hidden.includes(dataset.label),
          borderColor: dataset.borderColor,
          borderDash: dataset.borderDash,
        });
      });
      return categories;
    },
    showStandardLegend() {
      return this.legendItems.length < 12;
    },
  },
  watch: {
    chart(newChart) {
      this.defaultHiddenDatasets(newChart);
    },
  },
  mounted() {
    this.defaultHiddenDatasets(this.chart);
  },
  methods: {
    toggleDataset(label) {
      if (!this.chart) return;
      const dataset = this.chart.data.datasets.find((dataset) => dataset.label === label);
      if (!dataset) return;
      this.$store.commit("chartLegend/toggleDataset", dataset.label);
      this.applyHiddenDatasetsToChart();
    },
    defaultHiddenDatasets(chart) {
      if (chart && chart.data && chart.data.datasets.length) {
        const defaultHiddenDatasets = chart.data.datasets
          .filter((dataset) => dataset.hidden)
          .map((dataset) => dataset.label);
        this.$store.commit("chartLegend/setHiddenDatasets", defaultHiddenDatasets);
        this.applyHiddenDatasetsToChart();
      }
    },
    applyHiddenDatasetsToChart() {
      if (!this.chart || !this.chart.data) return;
      const hidden = this.$store.state.chartLegend.hiddenDatasets;
      this.chart.data.datasets.forEach((dataset) => {
        dataset.hidden = hidden.includes(dataset.label);
      });
      this.chart.update();
    },
  },
};
</script>
