<template>
  <openwb-base-card
    subtype="warning"
    :collapsible="true"
    :collapsed="true"
    class="pb-0"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'car-battery']"
      />
      {{ battery.name }}
    </template>
    <template #actions>
      <div v-if="getFaultStateSubtype(baseTopic) == 'success'">
        {{ formatNumberTopic(baseTopic + "/get/power", 1, 1, 0.001) }} kW /
        {{ $store.state.mqtt[baseTopic + "/get/soc"] }}%
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
      body-bg="bg-white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col-6 text-right">Leistung</div>
        <div class="col-6 text-right">Ladestand</div>
      </div>
      <div class="row">
        <div class="col text-right text-monospace pl-0">
          {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}&nbsp;kW
        </div>
        <div class="col text-right text-monospace pl-0">{{ $store.state.mqtt[baseTopic + "/get/soc"] }}&nbsp;%</div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      title="Zählerstände"
      subtype="white"
      body-bg="bg-white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col"></div>
        <div class="col text-right">Geladen</div>
        <div class="col text-right">Entladen</div>
      </div>
      <div class="row">
        <div class="col text-right">Heute</div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/daily_imported", 3, 3, 0.001) + "&nbsp;kWh" }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/daily_exported", 3, 3, 0.001) + "&nbsp;kWh" }}
        </div>
      </div>
      <div class="row">
        <div class="col text-right">Gesamt</div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/imported", 3, 3, 0.001) + "&nbsp;kWh" }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) + "&nbsp;kWh" }}
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
          <div class="col col-auto">
            <div class="text-right">ID: {{ battery.id }}</div>
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
  faCarBattery as fasCarBattery,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasCarBattery);

export default {
  name: "BatteryCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    battery: { type: Object, required: true },
  },
  data() {
    return {
      statusLevel: ["success", "warning", "danger"],
    };
  },
  computed: {
    baseTopic: {
      get() {
        return "openWB/bat/" + this.battery.id;
      },
    },
  },
};
</script>
