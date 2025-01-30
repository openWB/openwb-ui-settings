<template>
  <openwb-base-card
    subtype="info"
    :collapsible="true"
    :collapsed="true"
    class="pb-0"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'car']"
      />
      {{ vehicleName }}
    </template>
    <template #actions>
      <div
        v-if="getVehicleStatus == 'success'"
        class="text-right"
      >
        <div v-if="soc != '-'">{{ soc }}&nbsp;%</div>
      </div>
      <span
        v-else
        class="subheader pill"
        :class="'bg-' + getVehicleStatus"
      >
        <div v-if="getVehicleStatus == 'warning'">Info</div>
        <div v-else>Fehler</div>
      </span>
    </template>
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
    <template #footer>
      <div class="container">
        <div class="row">
          <div class="col px-0">
            <openwb-base-alert :subtype="getVehicleStatus">
              <font-awesome-icon
                fixed-width
                :icon="stateIcon"
              />
              Modulmeldung:
              <span style="white-space: pre-wrap">{{ $store.state.mqtt[baseTopic + "/get/fault_str"] }}</span>
            </openwb-base-alert>
          </div>
          <div class="col col-auto pr-0">
            <div class="text-right">ID: {{ vehicleIndex }}</div>
          </div>
        </div>
      </div>
    </template>
  </openwb-base-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle as fasCheckCircle,
  faExclamationTriangle as fasExclamationTriangle,
  faTimesCircle as fasTimesCircle,
  faCar as fasCar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasCar);

export default {
  name: "VehicleCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    vehicle: { type: Object, required: false, default: undefined },
    vehicleKey: { type: String, required: true },
    vehicleName: { type: String, default: "" },
  },
  computed: {
    vehicleIndex: {
      get() {
        return parseInt(this.vehicleKey.match(/(?:\/)(\d+)(?=\/)/)[1]);
      },
    },
    soc: {
      get() {
        return this.formatNumberTopic(this.baseTopic + "/get/soc");
      },
    },
    socTimestamp: {
      get() {
        if (this.$store.state.mqtt["openWB/vehicle/" + this.vehicleIndex + "/get/soc_timestamp"] !== undefined) {
          return new Date(
            this.$store.state.mqtt["openWB/vehicle/" + this.vehicleIndex + "/get/soc_timestamp"] * 1000,
          ).toLocaleString();
        } else {
          return "-";
        }
      },
    },
    socRange: {
      get() {
        if (this.$store.state.mqtt["openWB/vehicle/" + this.vehicleIndex + "/get/range"] !== undefined) {
          return Math.round(this.$store.state.mqtt["openWB/vehicle/" + this.vehicleIndex + "/get/range"]);
        } else {
          return 0;
        }
      },
    },
    getVehicleStatus: {
      get() {
        if (this.$store.state.mqtt["openWB/vehicle/" + this.vehicleIndex + "/get/fault_state"] === undefined) {
          return "success"; // Default status level for undefined
        }
        return (
          this.statusLevel[this.$store.state.mqtt["openWB/vehicle/" + this.vehicleIndex + "/get/fault_state"]] ||
          "success"
        ); // Default to 'light' if faultState is not in statusLevel}
      },
    },
    baseTopic: {
      get() {
        return "openWB/vehicle/" + this.vehicleIndex;
      },
    },
  },
};
</script>
