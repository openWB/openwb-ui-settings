<template>
  <status-card
    subtype="success"
    :component-id="inverter.id"
    :state="$store.state.mqtt[baseTopic + '/get/fault_state']"
    :state-message="$store.state.mqtt[baseTopic + '/get/fault_str']"
  >
    <template #header-left>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'solar-panel']"
      />
      {{ inverter.name }}
    </template>
    <template #header-right>{{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}&nbsp;kW</template>
    <!-- Aktuelle Werte -->
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
          {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) }}&nbsp;kW
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) }}&nbsp;kWh
        </div>
      </div>
    </openwb-base-card>
    <!-- Erträge -->
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
          {{ formatNumberTopic(baseTopic + "/get/daily_exported", 3, 3, 0.001) }}&nbsp;kWh
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/monthly_exported", 1, 1, 0.001) }}&nbsp;kWh
        </div>
        <div class="col text-right text-monospace">
          {{ formatNumberTopic(baseTopic + "/get/yearly_exported", 0, 0, 0.001) }}&nbsp;kWh
        </div>
      </div>
    </openwb-base-card>
    <!-- Werte pro Phase -->
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
import { faSolarPanel as fasSolarPanel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasSolarPanel);

export default {
  name: "InverterCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    inverter: { type: Object, required: true },
  },
  data() {
    return {
      mqttTopicsToSubscribe: [`openWB/pv/${this.inverter.id}/get/+`],
    };
  },
  computed: {
    baseTopic: {
      get() {
        return "openWB/pv/" + this.inverter.id;
      },
    },
  },
};
</script>
