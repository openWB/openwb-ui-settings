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
      Alle Ladepunkte
    </template>
    <template #actions>
      {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) + " kW" }}
    </template>
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-4"
    >
      <div class="row py-2">
        <div class="col font-weight-bold">Ladevorgang</div>
        <div class="col text-right">Leistung</div>
      </div>
      <div class="row">
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}
        </div>
      </div>
    </openwb-base-card>

    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-1 mb-4"
      title="Zählerstände"
    >
      <div class="row">
        <div class="col" />
        <div class="col text-right">Geladen</div>
        <div class="col text-right">Entladen</div>
      </div>
      <div class="row">
        <div class="col text-right">Heute</div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/daily_imported", 3, 3, 0.001) + " kWh" }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/daily_exported", 3, 3, 0.001) + " kWh" }}
        </div>
      </div>
      <div class="row">
        <div class="col text-right">Gesamt</div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/imported", 3, 3, 0.001) + " kWh" }}
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) + " kWh" }}
        </div>
      </div>
    </openwb-base-card>
  </openwb-base-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faChargingStation as fasChargingStation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasChargingStation);

export default {
  name: "ChargePointSumCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  computed: {
    baseTopic: {
      get() {
        return "openWB/chargepoint";
      },
    },
  },
};
</script>
