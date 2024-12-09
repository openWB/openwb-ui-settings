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
        :class="'subheader pill bg-' + getFaultStateSubtype(baseTopic)"
      >
        <div v-if="getFaultStateSubtype(baseTopic) == 'warning'">Warnung</div>
        <div v-else>Fehler</div>
      </span>
    </template>

    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row py-2">
        <div class="col col-auto font-weight-bold">Status</div>
        <div class="col text-right">
          <font-awesome-icon
            fixed-width
            :icon="chargingStatus.icon"
            :title="chargingStatus.text"
          />
          {{ chargingStatus.text }}
        </div>
      </div>

      <openwb-base-alert subtype="info">
        Statusmeldung:<br />
        <span style="white-space: pre-wrap">{{ $store.state.mqtt[baseTopic + "/get/state_str"] }}</span>
      </openwb-base-alert>
    </openwb-base-card>

    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
      title="Ladevorgang"
    >
      <div class="row">
        <div class="col text-right">Ladestrom Vorgabe</div>
        <div class="col text-right">Leistung</div>
      </div>
      <div class="row">
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/set/current", 2) }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}
        </div>
      </div>
      <div class="row">
        <div class="col text-right">Phasen Vorgabe</div>
        <div class="col text-right">Phasen Aktuell</div>
      </div>
      <div class="row">
        <div
          v-if="$store.state.mqtt['openWB/general/extern'] === true"
          class="col text-right text-monospace"
        >
          {{ formatNumberTopic("openWB/internal_chargepoint/" + chargePointIndex + "/data/phases_to_use") }}
        </div>
        <div
          v-else
          class="col text-right text-monospace"
        >
          {{ formatNumberTopic(baseTopic + "/set/phases_to_use") }}
        </div>

        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/phases_in_use") }}
        </div>
      </div>
    </openwb-base-card>

    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
      title="Zählerstände"
    >
      <div class="row justify-content-end">
        <div class="col-4 text-right">Geladen</div>
        <div class="col-4 text-right">Entladen</div>
      </div>
      <div class="row">
        <div class="col text-right">Heute</div>
        <div class="col-4 text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/daily_imported", 3, 3, 0.001) + " kWh" }}
        </div>
        <div class="col-4 text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/daily_exported", 3, 3, 0.001) + " kWh" }}
        </div>
      </div>
      <div class="row">
        <div class="col text-right">Gesamt</div>
        <div class="col-4 text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/imported", 3, 3, 0.001) + " kWh" }}
        </div>
        <div class="col-4 text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) + " kWh" }}
        </div>
      </div>
    </openwb-base-card>

    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
      title="Werte pro Phase"
    >
      <div class="row">
        <div class="col-md-4 pr-1 text-center text-md-right">Spannung [V]</div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1).split(" / ")[0] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1).split(" / ")[1] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1).split(" / ")[2] }}
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-1 text-center text-md-right">Strom [A]</div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2).split(" / ")[0] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2).split(" / ")[1] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2).split(" / ")[2] }}
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-1 text-center text-md-right">Wirkleistung [kW]</div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001).split(" / ")[0] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001).split(" / ")[1] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001).split(" / ")[2] }}
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-1 text-center text-md-right">Leistungsfaktor</div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2).split(" / ")[0] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2).split(" / ")[1] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2).split(" / ")[2] }}
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-1 text-center text-md-right">Netzfrequenz</div>
        <div class="col text-center text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/frequency", 3) + " Hz" }}
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
              <span style="white-space: pre-wrap">{{ $store.state.mqtt[baseTopic + "/get/fault_str"] }}</span>
            </openwb-base-alert>
          </div>
          <div class="col col-auto pr-0">
            <div class="text-right">ID: {{ chargePointIndex }}</div>
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
