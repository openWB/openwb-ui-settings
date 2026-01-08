<template>
  <status-card
    subtype="primary"
    :component-id="chargePointIndex"
    :state="$store.state.mqtt[baseTopic + '/get/fault_state']"
    :state-message="$store.state.mqtt[baseTopic + '/get/fault_str']"
  >
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'charging-station']" />
      {{ installedChargePoint.name }}
    </template>
    <template #header-right>{{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}&nbsp;kW</template>
    <!-- Status -->
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row py-2">
        <div class="col col-auto font-weight-bold">Status</div>
        <div class="col text-right">
          <font-awesome-icon
            :icon="chargingStatus.icon"
            :title="chargingStatus.text"
          />
          {{ chargingStatus.text }}
        </div>
      </div>

      <openwb-base-alert subtype="info">
        Statusmeldung:
        <span style="white-space: pre-wrap">{{ $store.state.mqtt[baseTopic + "/get/state_str"] }}</span>
      </openwb-base-alert>
      <div>
        max. Ladeleistung:
        {{
          (max_power = formatNumberTopic(baseTopic + "/get/max_evse_current", 0)) == "-"
            ? max_power
            : (() => {
                const powerKw = Math.floor((max_power * 3 * 230) / 1000);
                if (powerKw === 13) {
                  return "20A 1-phasig, 16A 3-phasig";
                }
                return powerKw + " kW";
              })()
        }}
      </div>
    </openwb-base-card>
    <!-- Ladevorgang -->
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
        <div class="col text-right text-monospace">{{ formatNumberTopic(baseTopic + "/set/current", 2) }}&nbsp;A</div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}&nbsp;kW
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
    <!-- Zählerstände -->
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
          {{ formatNumberTopic(baseTopic + "/get/daily_imported", 3, 3, 0.001) }}&nbsp;kWh
        </div>
        <div class="col-4 text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/daily_exported", 3, 3, 0.001) }}&nbsp;kWh
        </div>
      </div>
      <div class="row">
        <div class="col text-right">Gesamt</div>
        <div class="col-4 text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/imported", 3, 3, 0.001) }}&nbsp;kWh
        </div>
        <div class="col-4 text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) }}&nbsp;kWh
        </div>
      </div>
    </openwb-base-card>
    <!-- Werte pro Phase -->
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
      title="Werte pro Phase"
    >
      <div class="row">
        <div class="col-md-4 pr-1 text-center text-md-right">Spannung [V]</div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1)[0] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1)[1] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1)[2] }}
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-1 text-center text-md-right">Strom [A]</div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2)[0] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2)[1] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2)[2] }}
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-1 text-center text-md-right">Wirkleistung [kW]</div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001)[0] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001)[1] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001)[2] }}
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-1 text-center text-md-right">Leistungsfaktor</div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2)[0] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2)[1] }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2)[2] }}
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-1 text-center text-md-right">Netzfrequenz</div>
        <div class="col text-center text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/frequency", 3) }}&nbsp;Hz
        </div>
      </div>
    </openwb-base-card>
  </status-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import StatusCard from "./StatusCard.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
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
    StatusCard,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    installedChargePointKey: { type: String, required: true },
    installedChargePoint: { type: Object, required: true },
  },
  data() {
    return {
      mqttTopicsToSubscribe: [
        `openWB/chargepoint/${this.installedChargePoint.id}/get/+`,
        `openWB/chargepoint/${this.installedChargePoint.id}/get/connected_vehicle/info`,
        `openWB/chargepoint/${this.installedChargePoint.id}/set/+`,
        `openWB/internal_chargepoint/${this.installedChargePoint.id}/data/phases_to_use`,
      ],
    };
  },
  computed: {
    chargePointIndex: {
      get() {
        return this.installedChargePoint.id;
      },
    },
    baseTopic: {
      get() {
        return "openWB/chargepoint/" + this.chargePointIndex;
      },
    },
    chargingStatus: {
      get() {
        let plugState = this.$store.state.mqtt[this.baseTopic + "/get/plug_state"];
        let chargeState = this.$store.state.mqtt[this.baseTopic + "/get/charge_state"];

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
