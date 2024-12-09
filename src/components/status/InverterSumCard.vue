<template>
  <openwb-base-card
    subtype="success"
    :collapsible="true"
    :collapsed="true"
    class="pb-0"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'solar-panel']"
      />
      Alle Wechselrichter
    </template>
    <template #actions>
      <div
        v-if="getFaultStateSubtype(baseTopic) == 'success'"
        class="text-right"
      >
        {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}&nbsp;kW
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
      title="Aktuelle Werte"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col text-right">Leistung</div>
        <div class="col text-right">Zählerstand</div>
      </div>
      <div class="row">
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) + " kW" }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) + " kWh" }}
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      title="Erträge"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col text-right">Heute</div>
        <div class="col text-right">Monat</div>
        <div class="col text-right">Jahr</div>
      </div>
      <div class="row">
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/daily_exported", 3, 3, 0.001) + " kWh" }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/monthly_exported", 1, 1, 0.001) + " kWh" }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/yearly_exported", 0, 0, 0.001) + " kWh" }}
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
  computed: {
    baseTopic: {
      get() {
        return "openWB/pv";
      },
    },
  },
};
</script>
