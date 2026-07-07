<template>
  <status-card subtype="purple">
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'plug']" />
      Alle Verbraucher
    </template>
    <template #header-right>
      <span class="text-right"> {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}&nbsp;kW </span>
    </template>
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
      title="Aktuelle Werte"
    >
      <div class="row">
        <div class="col pr-0 text-right">Leistung</div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}&nbsp;kW
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
        <div class="col-4 text-right">Import</div>
        <div class="col-4 text-right">Export</div>
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
  </status-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import StatusCard from "./StatusCard.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlug as fasPlug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlug);

export default {
  name: "ConsumerSumCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/consumer/get/power", writeable: false },
        { topic: "openWB/consumer/get/imported", writeable: false },
        { topic: "openWB/consumer/get/exported", writeable: false },
        { topic: "openWB/consumer/get/daily_imported", writeable: false },
        { topic: "openWB/consumer/get/daily_exported", writeable: false },
      ],
    };
  },
  computed: {
    baseTopic: {
      get() {
        return "openWB/consumer";
      },
    },
  },
};
</script>
