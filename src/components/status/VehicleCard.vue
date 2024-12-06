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
      {{ vehicleName }}
    </template>
    <template #actions>
      <div v-if="getVehicleStatus == 'success'">
        <div v-if="$store.state.mqtt[baseTopic + '/get/soc']">{{ $store.state.mqtt[baseTopic + "/get/soc"] }}%</div>
      </div>
      <openwb-base-label
        v-else-if="$store.state.mqtt[baseTopic + '/get/fault_state'] == undefined"
        subtype="warning"
      />
      <openwb-base-label
        v-else
        :subtype="statuslevel[$store.state.mqtt[baseTopic + '/get/fault_state']]"
      />
    </template>
    <openwb-base-alert subtype="light">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th colspan="3">Fahrzeugdaten</th>
          </tr>
          <tr>
            <td class="text-right">Ladestand</td>
            <td class="text-right">Reichweite</td>
            <td class="text-right">Letzter Zeitstempel</td>
          </tr>
          <tr>
            <td class="text-right text-monospace">
              {{ formatNumberTopic($store.state.mqtt[baseTopic + "/get/soc"], 1, 1, 0.001) + " %" }}
            </td>
            <td class="text-right text-monospace">
              {{ socRange + " km" }}
            </td>
            <td class="text-right text-monospace">{{ socTimestamp }}</td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>
    <template #footer>
      <div class="container">
        <div class="row">
          <div class="col">
            <openwb-base-alert :subtype="getVehicleStatus">
              <font-awesome-icon
                v-if="$store.state.mqtt[baseTopic + '/get/fault_state'] == 1"
                fixed-width
                :icon="['fas', 'exclamation-triangle']"
              />
              <font-awesome-icon
                v-else-if="$store.state.mqtt[baseTopic + '/get/fault_state'] == 2"
                fixed-width
                :icon="['fas', 'times-circle']"
              />
              <font-awesome-icon
                v-else
                fixed-width
                :icon="['fas', 'check-circle']"
              />
              Modulmeldung:
              <span v-if="$store.state.mqtt[baseTopic + '/get/fault_state'] != 0">
                <br />
              </span>
              <span style="white-space: pre-wrap">{{ $store.state.mqtt[baseTopic + "/get/fault_str"] }}</span>
            </openwb-base-alert>
          </div>
          <div class="col col-auto">
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
