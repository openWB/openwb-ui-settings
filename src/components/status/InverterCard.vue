<template>
  <openwb-base-card
    subtype="success"
    :collapsible="true"
    :collapsed="true"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'solar-panel']"
      />
      {{ inverter.name }} {{ formatNumberTopic("openWB/pv/" + inverter.id + "/get/power", 3, 3, 0.001) }} kW
      <font-awesome-icon
        v-if="$store.state.mqtt['openWB/pv/' + inverter.id + '/get/fault_state'] == 1"
        fixed-width
        :icon="['fas', 'exclamation-triangle']"
        class="text-warning"
      />
      <font-awesome-icon
        v-else-if="$store.state.mqtt['openWB/pv/' + inverter.id + '/get/fault_state'] == 2"
        fixed-width
        :icon="['fas', 'times-circle']"
        class="text-danger"
      />
    </template>

    <openwb-base-alert :subtype="statusLevel[5]">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th>Aktuelle Werte</th>
            <td class="text-right">Leistung</td>
            <td class="text-right">Zählerstand</td>
          </tr>
          <tr>
            <td></td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/pv/" + inverter.id + "/get/power", 3, 3, 0.001) + " kW" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/pv/" + inverter.id + "/get/exported", 3, 3, 0.001) + " kWh" }}
            </td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>
    <openwb-base-alert :subtype="statusLevel[5]">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th rowspan="2">Erträge</th>
            <td class="text-right">Heute</td>
            <td class="text-right">Monat</td>
            <td class="text-right">Jahr</td>
          </tr>
          <tr>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/pv/" + inverter.id + "/get/daily_exported", 3, 3, 0.001) + " kWh" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/pv/" + inverter.id + "/get/monthly_exported", 1, 1, 0.001) + " kWh" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/pv/" + inverter.id + "/get/yearly_exported", 0, 0, 0.001) + " kWh" }}
            </td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>
    <template #footer>
      <openwb-base-alert :subtype="statusLevel[$store.state.mqtt['openWB/pv/' + inverter.id + '/get/fault_state']]">
        <font-awesome-icon
          v-if="$store.state.mqtt['openWB/pv/' + inverter.id + '/get/fault_state'] == 1"
          fixed-width
          :icon="['fas', 'exclamation-triangle']"
        />
        <font-awesome-icon
          v-else-if="$store.state.mqtt['openWB/pv/' + inverter.id + '/get/fault_state'] == 2"
          fixed-width
          :icon="['fas', 'times-circle']"
        />
        <font-awesome-icon
          v-else
          fixed-width
          :icon="['fas', 'check-circle']"
        />
        Modulmeldung:
        <span v-if="$store.state.mqtt['openWB/pv/' + inverter.id + '/get/fault_state'] != 0">
          <br />
        </span>
        <span style="white-space: pre-wrap">{{
          $store.state.mqtt["openWB/pv/" + inverter.id + "/get/fault_str"]
        }}</span>
      </openwb-base-alert>
      <div class="text-right ml-4">ID: {{ inverter.id }}</div>
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
  faSolarPanel as fasSolarPanel,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasSolarPanel);

export default {
  name: "InverterCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    inverter: { type: Object, required: true },
  },
  data() {
    return {
      statusLevel: ["success", "warning", "danger", "primary", "secondary", "light", "dark"],
    };
  },
};
</script>
