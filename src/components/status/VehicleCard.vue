<template>
  <openwb-base-card
    subtype="info"
    :collapsible="true"
    :collapsed="true"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'car']"
      />
      {{ vehicleName }} (ID: {{ vehicleIndex }})
    </template>
    <openwb-base-alert
      v-if="$store.state.mqtt['openWB/vehicle/' + vehicleIndex + '/get/fault_state'] !== undefined"
      :subtype="statusLevel[$store.state.mqtt['openWB/vehicle/' + vehicleIndex + '/get/fault_state']]"
    >
      <font-awesome-icon
        v-if="$store.state.mqtt['openWB/vehicle/' + vehicleIndex + '/get/fault_state'] == 1"
        fixed-width
        :icon="['fas', 'exclamation-triangle']"
      />
      <font-awesome-icon
        v-else-if="$store.state.mqtt['openWB/vehicle/' + vehicleIndex + '/get/fault_state'] == 2"
        fixed-width
        :icon="['fas', 'times-circle']"
      />
      <font-awesome-icon
        v-else
        fixed-width
        :icon="['fas', 'check-circle']"
      />
      Modulmeldung:<br />
      <span style="white-space: pre-wrap">{{
        $store.state.mqtt["openWB/vehicle/" + vehicleIndex + "/get/fault_str"]
      }}</span>
    </openwb-base-alert>
    <openwb-base-heading>Fahrzeugdaten</openwb-base-heading>
    <openwb-base-number-input
      title="Ladestand"
      readonly
      class="text-right text-monospace"
      unit="%"
      :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleIndex + '/get/soc']"
    />
    <openwb-base-number-input
      title="Reichweite"
      readonly
      class="text-right text-monospace"
      unit="km"
      :model-value="socRange"
    />
    <openwb-base-text-input
      title="Letzter Zeitstempel"
      readonly
      class="text-right text-monospace"
      :model-value="socTimestamp"
    />
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
  data() {
    return {
      statusLevel: ["success", "warning", "danger"],
    };
  },
  computed: {
    vehicleIndex: {
      get() {
        return parseInt(this.vehicleKey.match(/(?:\/)(\d+)(?=\/)/)[1]);
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
  },
};
</script>
