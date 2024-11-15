<template>
  <openwb-base-card
    subtype="primary"
    :collapsible="true"
    :collapsed="true"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'charging-station']"
      />
      {{ installedChargePoint.name }} (ID: {{ chargePointIndex }})
    </template>
    <openwb-base-alert
      :subtype="statusLevel[$store.state.mqtt['openWB/chargepoint/' + chargePointIndex + '/get/fault_state']]"
    >
      <font-awesome-icon
        v-if="$store.state.mqtt['openWB/chargepoint/' + chargePointIndex + '/get/fault_state'] == 1"
        fixed-width
        :icon="['fas', 'exclamation-triangle']"
      />
      <font-awesome-icon
        v-else-if="$store.state.mqtt['openWB/chargepoint/' + chargePointIndex + '/get/fault_state'] == 2"
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
        $store.state.mqtt["openWB/chargepoint/" + chargePointIndex + "/get/fault_str"]
      }}</span>
    </openwb-base-alert>
    <openwb-base-alert subtype="info">
      Statusmeldung:<br />
      <span style="white-space: pre-wrap">{{
        $store.state.mqtt["openWB/chargepoint/" + chargePointIndex + "/get/state_str"]
      }}</span>
    </openwb-base-alert>
    <openwb-base-checkbox-input
      title="Fahrzeug angesteckt"
      disabled
      :model-value="$store.state.mqtt['openWB/chargepoint/' + chargePointIndex + '/get/plug_state'] == 1"
    />
    <openwb-base-checkbox-input
      title="Ladevorgang aktiv"
      disabled
      :model-value="$store.state.mqtt['openWB/chargepoint/' + chargePointIndex + '/get/charge_state'] == 1"
    />
    <openwb-base-text-input
      title="Zählerstand laden"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/imported', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Zählerstand entladen"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/exported', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Heute geladen"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/daily_imported', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Heute entladen"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/daily_exported', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Wirkleistung"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kW"
      :model-value="formatNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/power', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Ladestromvorgabe"
      readonly
      class="text-right text-monospace"
      step="0.01"
      unit="A"
      :model-value="formatNumberTopic('openWB/chargepoint/' + chargePointIndex + '/set/current', 2)"
    />
    <openwb-base-text-input
      title="Netzfrequenz"
      readonly
      class="text-right text-monospace"
      step="0.01"
      unit="Hz"
      :model-value="formatNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/frequency', 2)"
    />
    <openwb-base-heading>Werte pro Phase</openwb-base-heading>
    <openwb-base-text-input
      title="Spannung"
      readonly
      class="text-right text-monospace"
      unit="V"
      :model-value="formatPhaseArrayNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/voltages', 1)"
    />
    <openwb-base-text-input
      title="Strom"
      readonly
      class="text-right text-monospace"
      unit="A"
      :model-value="formatPhaseArrayNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/currents', 2)"
    />
    <openwb-base-text-input
      title="Wirkleistung"
      readonly
      class="text-right text-monospace"
      unit="kW"
      :model-value="formatPhaseArrayNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/powers', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Leistungsfaktor"
      readonly
      class="text-right text-monospace"
      :model-value="formatPhaseArrayNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/power_factors', 2)"
    />
    <openwb-base-heading>Phasen</openwb-base-heading>
    <openwb-base-text-input
      v-if="$store.state.mqtt['openWB/general/extern'] === true"
      title="Vorgabe"
      readonly
      class="text-right text-monospace"
      :model-value="formatNumberTopic('openWB/internal_chargepoint/' + chargePointIndex + '/data/phases_to_use')"
    />
    <openwb-base-text-input
      v-else
      title="Vorgabe"
      readonly
      class="text-right text-monospace"
      :model-value="formatNumberTopic('openWB/chargepoint/' + chargePointIndex + '/set/phases_to_use')"
    />
    <openwb-base-text-input
      title="Aktuell"
      readonly
      class="text-right text-monospace"
      :model-value="formatNumberTopic('openWB/chargepoint/' + chargePointIndex + '/get/phases_in_use')"
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
  faChargingStation as fasChargingStation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasChargingStation);

export default {
  name: "ChargePointCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    installedChargePointKey: { type: String, required: true },
    installedChargePoint: { type: Object, required: true },
  },
  data() {
    return {
      statusLevel: ["success", "warning", "danger"],
    };
  },
  computed: {
    chargePointIndex: {
      get() {
        return parseInt(this.installedChargePointKey.match(/(?:\/)(\d+)(?=\/)/)[1]);
      },
    },
  },
};
</script>
