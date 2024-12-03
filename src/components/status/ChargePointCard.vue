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
      {{ installedChargePoint.name }}
    </template>
    <template #actions>
      <div v-if="$store.state.mqtt['openWB/chargepoint/' + chargePointIndex + '/get/fault_state'] == 0">
        {{ formatNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/power", 3, 3, 0.001) }} kW
        <font-awesome-icon
          fixed-width
          :icon="chargingStatus.icon"
          :title="chargingStatus.text"
        />
      </div>
      <openwb-base-label
        v-else
        :subtype="statusLevel[$store.state.mqtt['openWB/chargepoint/' + chargePointIndex + '/get/fault_state']]"
      />
    </template>

    <openwb-base-alert subtype="light">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th>Status</th>
            <td class="text-right">
              <font-awesome-icon
                fixed-width
                :icon="chargingStatus.icon"
                :title="chargingStatus.text"
              />
              {{ chargingStatus.text }}
            </td>
          </tr>
        </tbody>
      </table>
      <openwb-base-alert subtype="info">
        Statusmeldung:<br />
        <span style="white-space: pre-wrap">{{
          $store.state.mqtt["openWB/chargepoint/" + chargePointIndex + "/get/state_str"]
        }}</span>
      </openwb-base-alert>
    </openwb-base-alert>
    <openwb-base-alert subtype="light">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th>Ladevorgang</th>
            <td class="text-right">Vorgabe Ladestrom</td>
            <td class="text-right">Leistung</td>
          </tr>
          <tr>
            <td />
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/" + chargePointIndex + "/set/current", 2) }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/power", 3, 3, 0.001) + " kW" }}
            </td>
          </tr>
          <tr>
            <th>Phasen</th>
            <td class="text-right">Vorgabe</td>
            <td class="text-right">Aktuell</td>
          </tr>

          <tr>
            <td></td>
            <td
              v-if="$store.state.mqtt['openWB/general/extern'] === true"
              class="text-right text-monospace"
            >
              {{ formatNumberTopic("openWB/internal_chargepoint/" + chargePointIndex + "/data/phases_to_use") }}
            </td>
            <td
              v-else
              class="text-right text-monospace"
            >
              {{ formatNumberTopic("openWB/chargepoint/" + chargePointIndex + "/set/phases_to_use") }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/phases_in_use") }}
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
            <td class="text-right">Geladen</td>
            <td class="text-right">Entladen</td>
          </tr>
          <tr>
            <td class="text-right">Heute</td>
            <td class="text-right text-monospace">
              {{
                formatNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/daily_imported", 3, 3, 0.001) +
                " kWh"
              }}
            </td>
            <td class="text-right text-monospace">
              {{
                formatNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/daily_exported", 3, 3, 0.001) +
                " kWh"
              }}
            </td>
          </tr>
          <tr>
            <td class="text-right">Gesamt</td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/imported", 3, 3, 0.001) + " kWh" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/exported", 3, 3, 0.001) + " kWh" }}
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
              {{ formatPhaseArrayNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/voltages", 1) + " V" }}
            </td>
          </tr>
          <tr>
            <td class="text-right">🔌Strom</td>
            <td class="text-right text-monospace">
              {{ formatPhaseArrayNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/currents", 2) + " A" }}
            </td>
          </tr>
          <tr>
            <td class="text-right">Wirkleistung</td>
            <td class="text-right text-monospace">
              {{
                formatPhaseArrayNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/powers", 3, 3, 0.001) +
                " kW"
              }}
            </td>
          </tr>
          <tr>
            <td class="text-right">Leistungsfaktor</td>
            <td class="text-right text-monospace">
              {{ formatPhaseArrayNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/power_factors", 2) }}
            </td>
          </tr>
          <tr>
            <td class="text-right">Netzfrequenz</td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/" + chargePointIndex + "/get/frequency", 3) + " Hz" }}
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
              Modulmeldung:
              <span v-if="$store.state.mqtt['openWB/chargepoint/' + chargePointIndex + '/get/fault_state'] != 0">
                <br />
              </span>
              <span style="white-space: pre-wrap">{{
                $store.state.mqtt["openWB/chargepoint/" + chargePointIndex + "/get/fault_str"]
              }}</span>
            </openwb-base-alert>
          </div>
          <div class="col col-auto">
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
    chargingStatus() {
      if (this.plugState == 1 && this.chargeState == 1) {
        return { icon: ["fas", "plug-circle-bolt"], text: "Fahrzeug angesteckt, Ladevorgang aktiv" };
      } else if (this.plugState == 1) {
        return { icon: ["fas", "plug-circle-check"], text: "Fahrzeug angesteckt, kein Ladevorgang aktiv" };
      } else {
        return { icon: ["fas", "plug-circle-minus"], text: "Kein Fahrzeug angesteckt" };
      }
    },
  },
};
</script>
