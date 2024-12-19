<template>
  <openwb-base-card
    subtype="primary"
    :collapsible="true"
    :collapsed="true"
    class="pb-0"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'charging-station']"
      />
      {{ installedChargePoint.name }}
    </template>
    <template #actions>
      <div
        v-if="getFaultStateSubtype(baseTopic) == 'success'"
        class="text-right"
      >
        {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}&nbsp;kW
        <font-awesome-icon
          fixed-width
          :icon="chargingStatus.icon"
          :title="chargingStatus.text"
        />
      </div>
      <span
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
      title="maximale Nennleistung"
      readonly
      class="text-right text-monospace"
      step="0.01"
      unit="kW"
      :model-value="
        Math.floor((formatNumberTopic(
          'openWB/chargepoint/' + chargePointIndex + '/get/max_evse_current',
          0,
        )*3*230/1000))
      "
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
  faPlug as fasPlug,
  faBolt as fasBolt,
  faBan as fasBan,
  faPlugCirclePlus as fasPlugCirclePlus,
  faPlugCircleMinus as fasPlugCircleMinus,
  faPlugCircleCheck as fasPlugCircleCheck,
  faPlugCircleBolt as fasPlugCircleBolt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  fasCheckCircle,
  fasExclamationTriangle,
  fasTimesCircle,
  fasChargingStation,
  fasPlug,
  fasBolt,
  fasBan,
  fasPlugCirclePlus,
  fasPlugCircleMinus,
  fasPlugCircleCheck,
  fasPlugCircleBolt,
);

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
  computed: {
    chargePointIndex: {
      get() {
        return parseInt(this.installedChargePointKey.match(/(?:\/)(\d+)(?=\/)/)[1]);
      },
    },
    baseTopic: {
      get() {
        return "openWB/chargepoint/" + this.chargePointIndex;
      },
    },
    chargingStatus: {
      get() {
        let ID = this.chargePointIndex;
        let plugState = this.$store.state.mqtt["openWB/chargepoint/" + ID + "/get/plug_state"];
        let chargeState = this.$store.state.mqtt["openWB/chargepoint/" + ID + "/get/charge_state"];

        if (plugState == 1 && chargeState == 1) {
          return { icon: ["fas", "plug-circle-bolt"], text: "Fahrzeug angesteckt, Ladevorgang aktiv" };
        } else if (plugState == 1) {
          return { icon: ["fas", "plug-circle-check"], text: "Fahrzeug angesteckt, kein Ladevorgang aktiv" };
        } else {
          return { icon: ["fas", "plug-circle-minus"], text: "Kein Fahrzeug angesteckt" };
        }
      },
    },
  },
};
</script>
