<template>
  <openwb-base-card
    subtype="danger"
    :collapsible="true"
    :collapsed="true"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'gauge-high']"
      />
      {{ counter.name }}
    </template>
    <template #actions>
      <div v-if="$store.state.mqtt['openWB/counter/' + counter.id + '/get/fault_state'] == 0">
        {{ formatNumberTopic("openWB/counter/" + counter.id + "/get/power", 3, 3, 0.001) }} kW
      </div>
      <openwb-base-label
        v-else
        subtype="$store.state.mqtt['openWB/counter/' + counter.id + '/get/fault_state']"
      />
    </template>
    <openwb-base-alert subtype="light">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th>Aktuelle Werte</th>
            <td class="text-right">Leistung</td>
          </tr>
          <tr>
            <td></td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/counter/" + counter.id + "/get/power", 3, 3, 0.001) + " kW" }}
            </td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>
    <openwb-base-alert subtype="light">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th>Zählerstände</th>
            <td class="text-right">Export</td>
            <td class="text-right">Import</td>
          </tr>
          <tr>
            <td></td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/counter/" + counter.id + "/get/exported", 3, 3, 0.001) + " kWh" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/counter/" + counter.id + "/get/imported", 3, 3, 0.001) + " kWh" }}
            </td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>
    <openwb-base-alert subtype="light">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th colspan="3">Werte pro Phase</th>
          </tr>
          <tr>
            <td class="text-right">⚡Spannung</td>
            <td class="text-right text-monospace">
              {{ formatPhaseArrayNumberTopic("openWB/counter/" + counter.id + "/get/voltages", 1) + " V" }}
            </td>
          </tr>
          <tr>
            <td class="text-right">🔌Strom</td>
            <td class="text-right text-monospace">
              {{ formatPhaseArrayNumberTopic("openWB/counter/" + counter.id + "/get/currents", 2) + " A" }}
            </td>
          </tr>
          <tr>
            <td class="text-right">Wirkleistung</td>
            <td class="text-right text-monospace">
              {{ formatPhaseArrayNumberTopic("openWB/counter/" + counter.id + "/get/powers", 3, 3, 0.001) + " kW" }}
            </td>
          </tr>
          <tr>
            <td class="text-right">Leistungsfaktor</td>
            <td class="text-right text-monospace">
              {{ formatPhaseArrayNumberTopic("openWB/counter/" + counter.id + "/get/power_factors", 2) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">Netzfrequenz</td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/counter/" + counter.id + "/get/frequency", 3) + " Hz" }}
            </td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>
    <template #footer>
      <div class="container">
        <div class="row">
          <div class="col">
            <openwb-base-alert
              :subtype="statusLevel[$store.state.mqtt['openWB/counter/' + counter.id + '/get/fault_state']]"
            >
              <font-awesome-icon
                v-if="$store.state.mqtt['openWB/counter/' + counter.id + '/get/fault_state'] == 1"
                fixed-width
                :icon="['fas', 'exclamation-triangle']"
              />
              <font-awesome-icon
                v-else-if="$store.state.mqtt['openWB/counter/' + counter.id + '/get/fault_state'] == 2"
                fixed-width
                :icon="['fas', 'times-circle']"
              />
              <font-awesome-icon
                v-else
                fixed-width
                :icon="['fas', 'check-circle']"
              />
              Modulmeldung:
              <span v-if="$store.state.mqtt['openWB/counter/' + counter.id + '/get/fault_state'] != 0">
                <br />
              </span>
              <span style="white-space: pre-wrap">{{
                $store.state.mqtt["'openWB/counter/' + counter.id + '/get//fault_str"]
              }}</span>
            </openwb-base-alert>
          </div>
          <div class="col col-auto">
            <div class="text-right">ID: {{ counter.id }}</div>
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
  faGaugeHigh as fasGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasGaugeHigh);

export default {
  name: "CounterCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    counter: { type: Object, required: true },
  },
  data() {
    return {
      statusLevel: ["success", "warning", "danger"],
    };
  },
};
</script>
