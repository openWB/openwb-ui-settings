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
      mqttTopics: [{ topic: "openWB/consumer/get/power", writeable: false }],
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
