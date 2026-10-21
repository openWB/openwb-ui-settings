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
      <openwb-base-time-series-chart
        :datasets="chartDatasets"
        y-axis-label="Leistung [kW]"
        :zoomable="true"
        :show-legend="false"
      />
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

export default {
  name: "ForecastCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
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
    };
  },
  computed: {
    forecastConfigured() {
      return this.$store.state.mqtt["openWB/optional/forecast/configured"];
    },
    // Manche Anbieter liefern mehrere Tage Prognose; die Kachel zeigt bewusst nur heute + morgen,
    // analog zu "Gesamt" auf der Konfigurationsseite - dort bleibt die volle Historie einsehbar.
    forecastEntries() {
      const values = this.$store.state.mqtt["openWB/optional/forecast/get/values"];
      if (!values) {
        return [];
      }
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const rangeStart = todayStart.getTime();
      const rangeEnd = rangeStart + 2 * 86400 * 1000;
      return Object.entries(values)
        .map(([key, value]) => ({ timestamp: Number(key) * 1000, value: Number(value) / 1000 }))
        .filter((entry) => entry.timestamp >= rangeStart && entry.timestamp < rangeEnd)
        .sort((a, b) => a.timestamp - b.timestamp);
    },
    chartDatasets() {
      return [
        {
          label: "Prognose Leistung",
          unit: "kW",
          color: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          fill: true,
          tension: 0.2,
          data: this.forecastEntries,
        },
      ];
    },
    currentForecast() {
      if (this.forecastEntries.length === 0) {
        return this.formatNumber(0, 2);
      }
      const now = Date.now();
      // anders als bei den Strompreisen enthalten die Prognosewerte auch bereits vergangene
      // Slots des Tages, daher reicht hier nicht einfach der erste Eintrag
      const currentSlot =
        [...this.forecastEntries].reverse().find((entry) => entry.timestamp <= now) || this.forecastEntries[0];
      return this.formatNumber(currentSlot.value || 0, 2);
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
  },
};
</script>
