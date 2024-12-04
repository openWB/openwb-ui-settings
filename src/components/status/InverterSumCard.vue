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
      Alle Wechselrichter
    </template>
    <template #actions>
      <div v-if="$store.state.mqtt[baseTopic + '/get/fault_state'] == 0">
        {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }} kW
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
            <th>Aktuelle Werte</th>
            <td class="text-right">Leistung</td>
            <td class="text-right">Zählerstand</td>
          </tr>
          <tr>
            <td></td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) + " kW" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) + " kWh" }}
            </td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>
    <openwb-base-alert subtype="light">
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
              {{ formatNumberTopic(baseTopic + "/get/daily_exported", 3, 3, 0.001) + " kWh" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic(baseTopic + "/get/monthly_exported", 1, 1, 0.001) + " kWh" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic(baseTopic + "/get/yearly_exported", 0, 0, 0.001) + " kWh" }}
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
  faSolarPanel as fasSolarPanel,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasSolarPanel);

export default {
  name: "InverterSumCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      statusLevel: ["success", "warning", "danger"],
    };
  },
  computed: {
    baseTopic: {
      get() {
        return "openWB/pv";
      },
    },
  },
};
</script>
