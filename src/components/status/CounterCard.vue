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
      {{ counter.name }} (ID: {{ counter.id }})
    </template>
    <openwb-base-alert :subtype="statusLevel[$store.state.mqtt['openWB/counter/' + counter.id + '/get/fault_state']]">
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
      Modulmeldung:<br />
      <span style="white-space: pre-wrap">{{
        $store.state.mqtt["openWB/counter/" + counter.id + "/get/fault_str"]
      }}</span>
    </openwb-base-alert>
    <openwb-base-alert
      v-if="$store.state.mqtt['openWB/counter/' + counter.id + '/get/state_str'] != undefined"
      subtype="info"
    >
      Statusmeldung:<br />
      <span style="white-space: pre-wrap">{{
        $store.state.mqtt["openWB/counter/" + counter.id + "/get/state_str"]
      }}</span>
    </openwb-base-alert>
    <openwb-base-heading>Zählerstände</openwb-base-heading>
    <openwb-base-text-input
      title="Export"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/counter/' + counter.id + '/get/exported', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Import"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/counter/' + counter.id + '/get/imported', 3, 3, 0.001)"
    />
    <openwb-base-heading>Saldierte Werte</openwb-base-heading>
    <openwb-base-text-input
      title="Wirkleistung"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kW"
      :model-value="formatNumberTopic('openWB/counter/' + counter.id + '/get/power', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Netzfrequenz"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="Hz"
      :model-value="formatNumberTopic('openWB/counter/' + counter.id + '/get/frequency', 3)"
    />
    <openwb-base-heading>Werte pro Phase</openwb-base-heading>
    <openwb-base-text-input
      title="Spannung"
      readonly
      class="text-right text-monospace"
      unit="V"
      :model-value="formatPhaseArrayNumberTopic('openWB/counter/' + counter.id + '/get/voltages', 1)"
    />
    <openwb-base-text-input
      title="Strom"
      readonly
      class="text-right text-monospace"
      unit="A"
      :model-value="formatPhaseArrayNumberTopic('openWB/counter/' + counter.id + '/get/currents', 2)"
    />
    <openwb-base-text-input
      title="Wirkleistung"
      readonly
      class="text-right text-monospace"
      unit="kW"
      :model-value="formatPhaseArrayNumberTopic('openWB/counter/' + counter.id + '/get/powers', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Leistungsfaktor"
      readonly
      class="text-right text-monospace"
      :model-value="formatPhaseArrayNumberTopic('openWB/counter/' + counter.id + '/get/power_factors', 2)"
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
