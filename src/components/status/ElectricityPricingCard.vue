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
      <template #header>Tarifinformationen</template>
      <div
        v-if="tariffProvider"
        class="row"
      >
        <div class="col-xl-3 pr-0">Stromtarif:</div>
        <div class="col ml-3">
          {{ tariffProvider }}
        </div>
      </div>
      <div
        v-if="gridFeeProvider"
        class="row"
      >
        <div class="col-xl-3 pr-0">Netzentgelte:</div>
        <div class="col ml-3">
          {{ gridFeeProvider }}
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <openwb-base-time-series-chart
        :datasets="chartDatasets"
        y-axis-label="Preis [ct/kWh]"
        :zoomable="true"
        :show-legend="showLegend"
        :y-axis-step-size="0.01"
      />
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

export default {
  name: "ElectricityPricingCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/optional/ep/configured", writeable: false },
        { topic: "openWB/optional/ep/flexible_tariff/get/fault_state", writeable: false },
        { topic: "openWB/optional/ep/flexible_tariff/get/fault_str", writeable: false },
        { topic: "openWB/optional/ep/flexible_tariff/get/prices", writeable: false },
        { topic: "openWB/optional/ep/flexible_tariff/provider", writeable: false },
        { topic: "openWB/optional/ep/get/prices", writeable: false },
        { topic: "openWB/optional/ep/grid_fee/get/fault_state", writeable: false },
        { topic: "openWB/optional/ep/grid_fee/get/fault_str", writeable: false },
        { topic: "openWB/optional/ep/grid_fee/get/prices", writeable: false },
        { topic: "openWB/optional/ep/grid_fee/provider", writeable: false },
      ],
    };
  },
  computed: {
    electricityPricingConfigured() {
      return this.$store.state.mqtt["openWB/optional/ep/configured"];
    },
    // proper scaling: timestamp seconds -> milliseconds, price €/Wh -> ct/kWh
    totalPriceEntries() {
      const entries = this.$store.state.mqtt["openWB/optional/ep/get/prices"];
      if (!entries) {
        return [];
      }
      return Object.entries(entries)
        .map(([key, value]) => ({ timestamp: Number(key) * 1000, value: value * 100000 }))
        .sort((a, b) => a.timestamp - b.timestamp);
    },
    // Stromtarif/Netzentgelt dürfen nicht weiter reichen als der Gesamtpreis.
    totalPriceCutoff() {
      const entries = this.totalPriceEntries;
      if (entries.length === 0) {
        return null;
      }
      const last = entries[entries.length - 1];
      if (entries.length === 1) {
        return new Date().setHours(23, 59, 59, 999).valueOf();
      }
      const previous = entries[entries.length - 2];
      return last.timestamp + (last.timestamp - previous.timestamp) - 1;
    },
    tariffEntries() {
      if (!this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/provider"]?.type) {
        return [];
      }
      return this.crossReferencedPriceEntries(this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/get/prices"]);
    },
    gridFeeEntries() {
      if (!this.$store.state.mqtt["openWB/optional/ep/grid_fee/provider"]?.type) {
        return [];
      }
      return this.crossReferencedPriceEntries(this.$store.state.mqtt["openWB/optional/ep/grid_fee/get/prices"]);
    },
    chartDatasets() {
      return [
        {
          label: "Gesamtpreis",
          unit: "ct/kWh",
          color: "rgba(0, 149, 0, 0.9)",
          backgroundColor: "rgba(0, 149, 0, 0.7)",
          stepped: true,
          data: this.totalPriceEntries,
        },
        {
          label: "Stromtarif",
          unit: "ct/kWh",
          color: "rgba(139, 0, 0, 0.9)",
          backgroundColor: "rgba(139, 0, 0, 0.9)",
          stepped: true,
          data: this.tariffEntries,
        },
        {
          label: "Netzentgelt",
          unit: "ct/kWh",
          color: "rgba(255, 0, 0, 0.4)",
          backgroundColor: "rgba(255, 0, 0, 0.4)",
          stepped: true,
          data: this.gridFeeEntries,
        },
      ];
    },
    currentPrice() {
      if (this.totalPriceEntries.length === 0) {
        return this.formatNumber(0, 2);
      }
      return this.formatNumber(this.totalPriceEntries[0].value || 0, 2);
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
  },
  methods: {
    crossReferencedPriceEntries(entries) {
      if (!entries) {
        return [];
      }
      const cutoff = this.totalPriceCutoff;
      return Object.entries(entries)
        .map(([key, value]) => ({ timestamp: Number(key) * 1000, value: value * 100000 }))
        .filter((entry) => cutoff === null || entry.timestamp <= cutoff)
        .sort((a, b) => a.timestamp - b.timestamp);
    },
  },
};
</script>
