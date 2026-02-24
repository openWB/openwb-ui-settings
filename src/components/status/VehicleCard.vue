<template>
  <status-card
    subtype="info"
    :component-id="vehicleId"
    :state="$store.state.mqtt[baseTopic + '/get/fault_state']"
    :state-message="$store.state.mqtt[baseTopic + '/get/fault_str']"
  >
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'car']" />
      {{ name }}
    </template>
    <template
      v-if="soc != '-'"
      #header-right
    >
      {{ soc }}&nbsp;%
    </template>
    <!-- Fahrzeugdaten -->
    <openwb-base-card
      title="Fahrzeuginformationen"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col pr-0">Hersteller</div>
        <div class="col text-monospace">{{ information.manufacturer }}</div>
      </div>
      <div class="row">
        <div class="col pr-0">Modell</div>
        <div class="col text-monospace">{{ information.model }}</div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      title="Fahrzeugdaten"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col pr-0 text-right">Ladestand</div>
        <div class="col pr-0 text-right">Reichweite</div>
        <div class="col pr-0 text-right">Letzter Zeitstempel</div>
      </div>
      <div class="row">
        <div class="col text-right text-monospace">{{ soc }}&nbsp;%</div>
        <div class="col text-right text-monospace">{{ socRange }}&nbsp;km</div>
        <div class="col text-right text-monospace">{{ socTimestamp }}</div>
      </div>
    </openwb-base-card>
  </status-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import StatusCard from "./StatusCard.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCar as fasCar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCar);

export default {
  name: "VehicleCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    vehicleId: { type: Number, required: true },
  },
  data() {
    return {
      mqttTopics: [
        { topic: `openWB/vehicle/${this.vehicleId}/get/+`, writeable: false },
        { topic: `openWB/vehicle/${this.vehicleId}/info`, writeable: false },
        { topic: `openWB/vehicle/${this.vehicleId}/name`, writeable: false },
      ],
    };
  },
  computed: {
    information: {
      get() {
        return this.$store.state.mqtt[this.baseTopic + "/info"];
      },
    },
    name: {
      get() {
        const nameTopic = this.baseTopic + "/name";
        if (this.$store.state.mqtt[nameTopic] !== undefined) {
          return this.$store.state.mqtt[nameTopic];
        } else {
          return `Fahrzeug ${this.vehicleId}`;
        }
      },
    },
    soc: {
      get() {
        return this.formatNumberTopic(this.baseTopic + "/get/soc");
      },
    },
    socTimestamp: {
      get() {
        if (this.$store.state.mqtt[this.baseTopic + "/get/soc_timestamp"] !== undefined) {
          return new Date(this.$store.state.mqtt[this.baseTopic + "/get/soc_timestamp"] * 1000).toLocaleString();
        } else {
          return "-";
        }
      },
    },
    socRange: {
      get() {
        if (this.$store.state.mqtt[this.baseTopic + "/get/range"] !== undefined) {
          return Math.round(this.$store.state.mqtt[this.baseTopic + "/get/range"]);
        } else {
          return 0;
        }
      },
    },
    baseTopic: {
      get() {
        return "openWB/vehicle/" + this.vehicleId;
      },
    },
  },
};
</script>
