<template>
  <status-card
    subtype="info"
    :component-id="vehicleId"
    :state="$store.state.mqtt[baseTopic + '/get/fault_state']"
    :state-message="$store.state.mqtt[baseTopic + '/get/fault_str']"
  >
    <template #header-left>
      <font-awesome-icon
        :icon="['fas', 'car']"
        class="fa-border"
        :style="{
          backgroundColor: color,
          color: getContrastColor(color),
          '--fa-border-color': getContrastColor(color),
        }"
      />
      {{ name }}
    </template>
    <template
      v-if="soc != '-' || priority !== null"
      #header-right
    >
      <span
        v-if="priority !== null"
        class="badge badge-pill badge-light mr-2"
        title="Rangfolge in der Prioritäten-Steuerung"
      >
        Prio {{ priority }}
      </span>
      <template v-if="soc != '-'">{{ soc }}&nbsp;%</template>
    </template>
    <!-- Fahrzeugdaten -->
    <openwb-base-card
      v-if="information !== undefined"
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
        <div class="col text-right text-monospace">{{ soc }}&nbsp;%</div>
      </div>
      <div class="row">
        <div class="col pr-0 text-right">Reichweite</div>
        <div class="col text-right text-monospace">{{ socRange }}&nbsp;km</div>
      </div>
      <div class="row">
        <div class="col pr-0 text-right">Letzter Zeitstempel</div>
        <div class="col text-right text-monospace">{{ socTimestamp }}</div>
      </div>
      <div class="row">
        <div class="col pr-0 text-right">Kilometerstand</div>
        <div class="col text-right text-monospace">{{ socOdometer }}&nbsp;km</div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      v-if="priority !== null"
      title="Priorität"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col pr-0 text-right">Rangfolge</div>
        <div class="col text-right text-monospace">Prio {{ priority }}</div>
      </div>
      <div
        v-if="prioritySharedGroup"
        class="row"
      >
        <div class="col text-right">
          <small>Gleichrangig mit anderen Geräten der selben Gruppe.</small>
        </div>
      </div>
      <div class="row">
        <div class="col text-right">
          <small>Die Rangfolge lässt sich unter „Lastmanagement“ anpassen.</small>
        </div>
      </div>
    </openwb-base-card>
  </status-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import LoadManagementPriority from "../mixins/LoadManagementPriority.vue";
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
  mixins: [ComponentState, LoadManagementPriority],
  props: {
    vehicleId: { type: Number, required: true },
  },
  data() {
    return {
      mqttTopics: [
        { topic: `openWB/vehicle/${this.vehicleId}/get/+`, writeable: false },
        { topic: `openWB/vehicle/${this.vehicleId}/info`, writeable: false },
        { topic: `openWB/vehicle/${this.vehicleId}/name`, writeable: false },
        { topic: `openWB/vehicle/${this.vehicleId}/color`, writeable: false },
        { topic: "openWB/counter/get/loadmanagement_prios", writeable: false },
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
    color: {
      get() {
        const colorTopic = this.baseTopic + "/color";
        if (this.$store.state.mqtt[colorTopic] !== undefined) {
          return this.$store.state.mqtt[colorTopic];
        } else {
          return "#17a2b8";
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
    socOdometer: {
      get() {
        if (
          this.$store.state.mqtt[this.baseTopic + "/get/odometer"] !== undefined &&
          this.$store.state.mqtt[this.baseTopic + "/get/odometer"] !== null
        ) {
          return Math.round(this.$store.state.mqtt[this.baseTopic + "/get/odometer"]);
        } else {
          return "-";
        }
      },
    },
    baseTopic: {
      get() {
        return "openWB/vehicle/" + this.vehicleId;
      },
    },
    priority: {
      get() {
        return this.loadManagementPriority("vehicle", this.vehicleId);
      },
    },
    prioritySharedGroup: {
      get() {
        return this.loadManagementPriorityShared("vehicle", this.vehicleId);
      },
    },
  },
};
</script>
