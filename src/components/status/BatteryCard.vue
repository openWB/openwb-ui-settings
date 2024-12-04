<template>
  <openwb-base-card
    subtype="warning"
    :collapsible="true"
    :collapsed="true"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'car-battery']"
      />
      {{ battery.name }}
    </template>
    <template #actions>
      <div v-if="$store.state.mqtt[baseTopic + '/get/fault_state'] == 0">
        {{ formatNumberTopic(baseTopic + "/get/power", 1, 1, 0.001) }} kW /
        {{ $store.state.mqtt[baseTopic + "/get/soc"] }}%
      </div>
      <openwb-base-label
        v-else-if="$store.state.mqtt[baseTopic + '/get/fault_state'] == undefined"
        subtype="warning"
      />
      <openwb-base-label
        v-else
        subtype="$store.state.mqtt['baseTopic + '/get/fault_state']"
      />
    </template>
    <openwb-base-alert subtype="light">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th>Aktuelle Werte</th>
            <td class="text-right">Leistung</td>
            <td class="text-right">Ladestand</td>
          </tr>
          <tr>
            <td></td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) + " kW" }}
            </td>
            <td class="text-right text-monospace">{{ $store.state.mqtt[baseTopic + "/get/soc"] }}%</td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>
    <openwb-base-alert subtype="light">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th>Zählerstand</th>
            <td class="text-right">Ladung</td>
            <td class="text-right">Entladung</td>
          </tr>
          <tr>
            <td></td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic(baseTopic + "/get/imported", 3, 3, 0.001) + " kWh" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) + " kWh" }}
            </td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>
    <template #footer>
      <div class="container">
        <div class="row">
          <div class="col">
            <openwb-base-alert :subtype="statusLevel[$store.state.mqtt[baseTopic + '/get/fault_state']]">
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
            <div class="text-right">ID: {{ battery.id }}</div>
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
  faCarBattery as fasCarBattery,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasCarBattery);

export default {
  name: "BatteryCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    battery: { type: Object, required: true },
  },
  data() {
    return {
      statusLevel: ["success", "warning", "danger"],
    };
  },
  computed: {
    baseTopic: {
      get() {
        return "openWB/bat/" + this.battery.id;
      },
    },
  },
};
</script>
