<template>
  <status-card
    v-if="electricityPricingConfigured"
    subtype="secondary"
    :state="combinedState"
    :state-message="combinedStateMessage"
  >
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'ranking-star']" />
      Strompreise
    </template>
    <template #header-right>{{ currentPrice }}&nbsp;ct/kWh</template>
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <template #header>Tarifinformationen</template>
      <div
        v-for="channel in channels"
        :key="channel.key"
        class="row"
      >
        <div class="col-xl-4 pr-0">{{ channel.label }}:</div>
        <div class="col ml-3">
          {{ channel.providerName }}
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <openwb-time-series-chart
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
import OpenwbTimeSeriesChart from "../OpenwbTimeSeriesChart.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faRankingStar as fasRankingStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasRankingStar);

const TOPIC_PREFIX = "openWB/optional/ep";

// Price channels besides the combined price. Sources of the energy mix are off in the chart until
// switched on in the legend, because they would only clutter the grid price most users care about.
const PRICE_CHANNELS = [
  { key: "flexible_tariff", label: "Stromtarif", color: "rgba(139, 0, 0, 0.9)" },
  { key: "grid_fee", label: "Netzentgelt", color: "rgba(255, 0, 0, 0.4)" },
  { key: "pv_price", label: "Preis für Erzeugung", color: "rgba(255, 140, 0, 0.9)", hiddenByDefault: true },
  { key: "bat_price", label: "Preis für Speicherentladung", color: "rgba(0, 90, 200, 0.9)", hiddenByDefault: true },
  { key: "feed_in_price", label: "Einspeisevergütung", color: "rgba(120, 60, 180, 0.9)", hiddenByDefault: true },
];

const CHANNEL_TOPICS = PRICE_CHANNELS.flatMap(({ key }) =>
  ["get/fault_state", "get/fault_str", "get/prices", "provider"].map((suffix) => `${TOPIC_PREFIX}/${key}/${suffix}`),
);

export default {
  name: "ElectricityPricingCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
    OpenwbTimeSeriesChart,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopics: [`${TOPIC_PREFIX}/configured`, `${TOPIC_PREFIX}/get/prices`, ...CHANNEL_TOPICS].map((topic) => ({
        topic,
        writeable: false,
      })),
    };
  },
  computed: {
    electricityPricingConfigured() {
      return this.epValue("configured");
    },
    // proper scaling: timestamp seconds -> milliseconds, price €/Wh -> ct/kWh
    totalPriceEntries() {
      const entries = this.epValue("get/prices");
      if (!entries) {
        return [];
      }
      return Object.entries(entries)
        .map(([key, value]) => ({ timestamp: Number(key) * 1000, value: value * 100000 }))
        .sort((a, b) => a.timestamp - b.timestamp);
    },
    // Die Einzelpreise dürfen nicht weiter reichen als der Gesamtpreis.
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
    // Only channels with a configured provider
    channels() {
      return PRICE_CHANNELS.flatMap((channel) => {
        const provider = this.epValue(`${channel.key}/provider`);
        if (!provider?.type) {
          return [];
        }
        return {
          ...channel,
          providerName: provider.name,
          entries: this.crossReferencedPriceEntries(this.epValue(`${channel.key}/get/prices`)),
          faultState: this.epValue(`${channel.key}/get/fault_state`) || 0,
          faultMessage: this.epValue(`${channel.key}/get/fault_str`),
        };
      });
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
        ...this.channels.map((channel) => ({
          label: channel.label,
          unit: "ct/kWh",
          color: channel.color,
          backgroundColor: channel.color,
          stepped: true,
          hiddenByDefault: channel.hiddenByDefault,
          data: channel.entries,
        })),
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
      return Math.max(0, ...this.channels.map((channel) => channel.faultState));
    },
    combinedStateMessage() {
      const messages = this.channels.map(
        (channel) => `${channel.label}: ${channel.faultState > 0 ? channel.faultMessage : "Kein Fehler."}`,
      );
      return messages.length > 0 ? messages.join("\n") : undefined;
    },
    showLegend() {
      return this.channels.length > 1;
    },
  },
  methods: {
    epValue(path) {
      return this.$store.state.mqtt[`${TOPIC_PREFIX}/${path}`];
    },
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
