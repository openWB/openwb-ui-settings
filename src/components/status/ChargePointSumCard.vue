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
    <openwb-base-text-input
      title="Leistung"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kW"
      :model-value="formatNumberTopic('openWB/chargepoint/get/power', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Zählerstand laden"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/chargepoint/get/imported', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Zählerstand entladen"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/chargepoint/get/exported', 3, 3, 0.001)"
    />
    <openwb-base-heading>Historie</openwb-base-heading>
    <openwb-base-text-input
      title="Heute geladen"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/chargepoint/get/daily_imported', 3, 3, 0.001)"
    />
    <openwb-base-text-input
      title="Heute entladen"
      readonly
      class="text-right text-monospace"
      step="0.001"
      unit="kWh"
      :model-value="formatNumberTopic('openWB/chargepoint/get/daily_exported', 3, 3, 0.001)"
    />
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
};
</script>
