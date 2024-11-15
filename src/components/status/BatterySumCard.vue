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
      Alle Speicher
    </template>
    <openwb-base-alert :subtype="statusLevel[$store.state.mqtt['openWB/bat/get/fault_state']]">
      <font-awesome-icon
        v-if="$store.state.mqtt['openWB/bat/get/fault_state'] == 1"
        fixed-width
        :icon="['fas', 'exclamation-triangle']"
      />
      <font-awesome-icon
        v-else-if="$store.state.mqtt['openWB/bat/get/fault_state'] == 2"
        fixed-width
        :icon="['fas', 'times-circle']"
      />
      <font-awesome-icon
        v-else
        fixed-width
        :icon="['fas', 'check-circle']"
      />
      Modulmeldung:<br />
      <span style="white-space: pre-wrap">{{ $store.state.mqtt["openWB/bat/get/fault_str"] }}</span>
    </openwb-base-alert>
    <openwb-base-heading>Zählerstände</openwb-base-heading>
    <openwb-base-text-input
      title="Ladung"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/bat/get/imported', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Entladung"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/bat/get/exported', 3, 3, 0.001)"
    />
    <openwb-base-heading>Tageswerte</openwb-base-heading>
    <openwb-base-text-input
      title="Ladung"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/bat/get/daily_imported', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Entladung"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/bat/get/daily_exported', 3, 3, 0.001)"
    />
    <openwb-base-heading>Saldierte Werte</openwb-base-heading>
    <openwb-base-text-input
      title="Leistung"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kW"
      :model-value="formatNumberTopic('openWB/bat/get/power', 3, 3, 0.001)"
    />
    <openwb-base-number-input
      title="Ladestand"
      readonly
      class="text-right text-monospace"
      unit="%"
      :model-value="$store.state.mqtt['openWB/bat/get/soc']"
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
  faCarBattery as fasCarBattery,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasCarBattery);

export default {
  name: "BatterySumCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      statusLevel: ["success", "warning", "danger"],
    };
  },
};
</script>
