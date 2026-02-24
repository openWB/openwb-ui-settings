<template>
  <status-card
    subtype="warning"
    :state="$store.state.mqtt[baseTopic + '/get/fault_state']"
    :state-message="$store.state.mqtt[baseTopic + '/get/fault_str']"
  >
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'car-battery']" />
      Alle Speicher
    </template>
    <template #header-right>
      {{ formatNumberTopic(baseTopic + "/get/power", 1, 1, 0.001) }}&nbsp;kW /
      {{ $store.state.mqtt[baseTopic + "/get/soc"] }}&nbsp;%
    </template>
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
  name: "BatterySumCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopics: [{ topic: "openWB/bat/get/+", writeable: false }],
    };
  },
  computed: {
    baseTopic: {
      get() {
        return "openWB/bat";
      },
    },
  },
};
</script>
