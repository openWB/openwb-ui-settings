<template>
  <openwb-base-card
    subtype="danger"
    :collapsible="true"
    :collapsed="true"
    class="pb-0"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'gauge-high']"
      />
      {{ counter.name }}
    </template>
    <template #actions>
      <div v-if="getFaultStateSubtype(baseTopic) == 'success'">
        {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}&nbsp;kW
      </div>
      <openwb-base-label
        v-else
        :subtype="getFaultStateSubtype(baseTopic)"
      />
    </template>
    <openwb-base-card
      title="Aktuelle Werte"
      subtype="white"
      body-bg="white"
      class="py-1"
    >
      <div class="row">
        <div class="col-6">Leistung</div>
        <div class="col text-right text-monospace pl-0">
          {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) + " kW" }}
        </div>
      </div>
      <div class="row">
        <div class="col-6">Netzfrequenz</div>
        <div class="col text-right text-monospace pl-0">
          {{ formatNumberTopic(baseTopic + "/get/frequency", 3) + " Hz" }}
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      title="Zählerstände"
      subtype="white"
      body-bg="white"
      class="py-1"
    >
      <div class="row">
        <div class="col-5">Export</div>
        <div class="col text-right text-monospace pl-0">
          {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) + " kWh" }}
        </div>
      </div>
      <div class="row">
        <div class="col-5">Import</div>
        <div class="col text-right text-monospace pl-0">
          {{ formatNumberTopic(baseTopic + "/get/imported", 3, 3, 0.001) + " kWh" }}
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      title="Werte pro Phase"
      subtype="white"
      body-bg="white"
      class="py-1"
    >
      <div class="row">
        <div class="col-md-4">Spannung [V]</div>
        <div class="col">
          <div class="row">
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1).split(" / ")[0] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1).split(" / ")[1] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1).split(" / ")[2] }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">Strom [A]</div>
        <div class="col">
          <div class="row">
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2).split(" / ")[0] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2).split(" / ")[1] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2).split(" / ")[2] }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">Wirkleistung [kW]</div>
        <div class="col">
          <div class="row">
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001).split(" / ")[0] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001).split(" / ")[1] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001).split(" / ")[2] }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">Leistungsfaktor</div>
        <div class="col">
          <div class="row">
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2).split(" / ")[0] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2).split(" / ")[1] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2).split(" / ")[2] }}
            </div>
          </div>
        </div>
      </div>
    </openwb-base-card>
    <template #footer>
      <div class="container">
        <div class="row">
          <div class="col px-0">
            <openwb-base-alert :subtype="getFaultStateSubtype(baseTopic)">
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
              <span style="white-space: pre-wrap">{{ $store.state.mqtt["baseTopic + '/get//fault_str"] }}</span>
            </openwb-base-alert>
          </div>
          <div class="col col-auto pr-0">
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
  computed: {
    baseTopic: {
      get() {
        return "openWB/counter/" + this.counter.id;
      },
    },
  },
};
</script>
