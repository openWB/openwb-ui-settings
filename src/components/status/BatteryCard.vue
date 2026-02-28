<template>
  <status-card
    subtype="warning"
    :component-id="battery.id"
    :state="$store.state.mqtt[baseTopic + '/get/fault_state']"
    :state-message="$store.state.mqtt[baseTopic + '/get/fault_str']"
  >
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'car-battery']" />
      {{ battery.name }}
    </template>
    <template #header-right>
      {{ formatNumberTopic(baseTopic + "/get/power", 1, 1, 0.001) }}&nbsp;kW /
      {{ $store.state.mqtt[baseTopic + "/get/soc"] }}&nbsp;%
    </template>
    <!-- Status -->
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row py-2">
        <div class="col col-auto font-weight-bold">Status</div>
      </div>

      <openwb-base-alert subtype="info">
        Aktive Speichersteuerung:
        <span style="white-space: pre-wrap">{{ $store.state.mqtt[baseTopic + "/get/state_str"] }}</span>
      </openwb-base-alert>
    </openwb-base-card>
    <!-- Aktuelle Werte -->
    <openwb-base-card
      title="Aktuelle Werte"
      subtype="white"
      body-bg="white"
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
    <!-- Zählerstände -->
    <openwb-base-card
      title="Zählerstände"
      subtype="white"
      body-bg="white"
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
          {{ formatNumberTopic(baseTopic + "/get/daily_imported", 3, 3, 0.001) }}&nbsp;kWh
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/daily_exported", 3, 3, 0.001) }}&nbsp;kWh
        </div>
      </div>
      <div class="row">
        <div class="col text-right">Gesamt</div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/imported", 3, 3, 0.001) }}&nbsp;kWh
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) }}&nbsp;kWh
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      title="Werte pro Phase"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col-md-4 pr-0 text-center text-md-right">Strom [A]</div>
        <div class="col">
          <div class="row">
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2)[0] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2)[1] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/currents", 2)[2] }}
            </div>
          </div>
        </div>
      </div>
    </openwb-base-card>
  </status-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import StatusCard from "./StatusCard.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCarBattery as fasCarBattery } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCarBattery);

export default {
  name: "BatteryCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    battery: { type: Object, required: true },
  },
  data() {
    return {
      mqttTopicsToSubscribe: [`openWB/bat/${this.battery.id}/get/+`],
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
