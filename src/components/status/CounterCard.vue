<template>
  <status-card
    subtype="danger"
    :component-id="counter.id"
    :state="$store.state.mqtt[baseTopic + '/get/fault_state']"
    :state-message="$store.state.mqtt[baseTopic + '/get/fault_str']"
  >
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'gauge-high']" />
      {{ counter.name }}
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
        <div class="col-6 text-right">Leistung</div>
        <div class="col-6 text-right">Netzfrequenz</div>
      </div>
      <div class="row">
        <div class="col text-right text-monospace pl-0">
          {{ formatNumberTopic(baseTopic + "/get/power", 3, 3, 0.001) + "&nbsp;kW" }}
        </div>
        <div class="col text-right text-monospace pl-0">
          {{ formatNumberTopic(baseTopic + "/get/frequency", 3) + "&nbsp;Hz" }}
        </div>
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
        <div class="col-6 text-right">Export</div>
        <div class="col-6 text-right">Import</div>
      </div>
      <div class="row">
        <div class="col text-right text-monospace pl-0">
          {{ formatNumberTopic(baseTopic + "/get/exported", 3, 3, 0.001) + "&nbsp;kWh" }}
        </div>
        <div class="col text-right text-monospace pl-0">
          {{ formatNumberTopic(baseTopic + "/get/imported", 3, 3, 0.001) + "&nbsp;kWh" }}
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
        <div class="col-md-4 pr-0 text-center text-md-right">Spannung [V]</div>
        <div class="col">
          <div class="row">
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1)[0] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1)[1] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/voltages", 1)[2] }}
            </div>
          </div>
        </div>
      </div>
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
      <div class="row">
        <div class="col-md-4 pr-0 text-center text-md-right">Wirkleistung [kW]</div>
        <div class="col">
          <div class="row">
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001)[0] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001)[1] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/powers", 3, 3, 0.001)[2] }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-0 text-center text-md-right">Leistungsfaktor</div>
        <div class="col">
          <div class="row">
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2)[0] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2)[1] }}
            </div>
            <div class="col text-right text-monospace pl-0">
              {{ formatPhaseArrayNumberTopic(baseTopic + "/get/power_factors", 2)[2] }}
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
import { faGaugeHigh as fasGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasGaugeHigh);

export default {
  name: "CounterCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    counter: { type: Object, required: true },
  },
  data() {
    return {
      mqttTopicsToSubscribe: [`openWB/counter/${this.counter.id}/get/+`],
    };
  },
  computed: {
    baseTopic: {
      get() {
        return "openWB/counter/" + this.counter.id;
      },
    },
  },
};
</script>
