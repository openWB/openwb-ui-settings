<template>
  <status-card
    subtype="purple"
    :component-id="consumerId"
    :state="$store.state.mqtt[baseTopic + '/get/fault_state']"
    :state-message="$store.state.mqtt[baseTopic + '/get/fault_str']"
  >
    <template #header-left>
      <font-awesome-icon :icon="['fas', 'plug']" />
      {{ name }}
    </template>
    <template #header-right>
      <span
        v-if="priority !== null"
        class="badge badge-pill badge-light mr-2"
        title="Rangfolge in der Prioritäten-Steuerung"
      >
        Prio {{ priority }}
      </span>
      {{ power }}&nbsp;kW
    </template>
    <openwb-base-card
      title="Aktuelle Werte"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col pr-0 text-right">Leistung</div>
        <div class="col text-right text-monospace">{{ power }}&nbsp;kW</div>
      </div>
      <div class="row">
        <div class="col pr-0 text-right">Status</div>
        <div class="col text-right text-monospace">{{ statusText }}</div>
      </div>
      <div
        v-if="chargemode !== null"
        class="row"
      >
        <div class="col pr-0 text-right">Betriebsmodus</div>
        <div class="col text-right text-monospace">{{ chargemode }}</div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      v-if="priority !== null"
      title="Priorität"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col pr-0 text-right">Rangfolge</div>
        <div class="col text-right text-monospace">Prio {{ priority }}</div>
      </div>
      <div
        v-if="prioritySharedGroup"
        class="row"
      >
        <div class="col text-right">
          <small>Gleichrangig mit anderen Geräten der selben Gruppe.</small>
        </div>
      </div>
      <div class="row">
        <div class="col text-right">
          <small>Die Rangfolge lässt sich unter „Lastmanagement“ anpassen.</small>
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      v-if="hasMeterData"
      title="Zählerstände"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
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
        <div class="col-4 text-right text-monospace">-</div>
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
    <openwb-base-card
      v-if="hasPhaseData"
      title="Werte pro Phase"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div class="col-md-4 pr-0 text-center text-md-right">Spannung [V]</div>
        <div class="col">
          <div class="row">
            <div
              v-for="(value, index) in formatPhaseArrayNumberTopic(baseTopic + '/get/voltages', 1)"
              :key="index"
              class="col text-right text-monospace pl-0"
            >
              {{ value }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-0 text-center text-md-right">Strom [A]</div>
        <div class="col">
          <div class="row">
            <div
              v-for="(value, index) in formatPhaseArrayNumberTopic(baseTopic + '/get/currents', 2)"
              :key="index"
              class="col text-right text-monospace pl-0"
            >
              {{ value }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 pr-0 text-center text-md-right">Leistung [kW]</div>
        <div class="col">
          <div class="row">
            <div
              v-for="(value, index) in formatPhaseArrayNumberTopic(baseTopic + '/get/powers', 3, 3, 0.001)"
              :key="index"
              class="col text-right text-monospace pl-0"
            >
              {{ value }}
            </div>
          </div>
        </div>
      </div>
    </openwb-base-card>
  </status-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import LoadManagementPriority from "../mixins/LoadManagementPriority.vue";
import StatusCard from "./StatusCard.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlug as fasPlug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlug);

export default {
  name: "ConsumerCard",
  components: {
    StatusCard,
    FontAwesomeIcon,
  },
  mixins: [ComponentState, LoadManagementPriority],
  props: {
    consumerId: { type: Number, required: true },
  },
  data() {
    return {
      mqttTopics: [
        { topic: `openWB/consumer/${this.consumerId}/module`, writeable: false },
        { topic: `openWB/consumer/${this.consumerId}/usage`, writeable: false },
        { topic: `openWB/consumer/${this.consumerId}/get/+`, writeable: false },
        { topic: "openWB/counter/get/loadmanagement_prios", writeable: false },
      ],
    };
  },
  computed: {
    baseTopic: {
      get() {
        return `openWB/consumer/${this.consumerId}`;
      },
    },
    name: {
      get() {
        const module = this.$store.state.mqtt[this.baseTopic + "/module"];
        return module?.name ?? `Verbraucher ${this.consumerId}`;
      },
    },
    power: {
      get() {
        return this.formatNumberTopic(this.baseTopic + "/get/power", 3, 3, 0.001);
      },
    },
    statusText: {
      get() {
        const stateString = this.$store.state.mqtt[this.baseTopic + "/get/state_str"];
        if (stateString) {
          return stateString;
        }
        const state = this.$store.state.mqtt[this.baseTopic + "/get/state"];
        if (state === undefined) {
          return "-";
        }
        return state ? "Eingeschaltet" : "Ausgeschaltet";
      },
    },
    chargemode: {
      get() {
        const usage = this.$store.state.mqtt[this.baseTopic + "/usage"];
        if (!usage || usage.chargemode === undefined) {
          return null;
        }
        return this.translateChargeMode(usage.chargemode);
      },
    },
    priority: {
      get() {
        return this.loadManagementPriority("consumer", this.consumerId);
      },
    },
    prioritySharedGroup: {
      get() {
        return this.loadManagementPriorityShared("consumer", this.consumerId);
      },
    },
    hasMeterData: {
      get() {
        return (
          this.$store.state.mqtt[this.baseTopic + "/get/imported"] !== undefined ||
          this.$store.state.mqtt[this.baseTopic + "/get/exported"] !== undefined
        );
      },
    },
    hasPhaseData: {
      get() {
        const currents = this.$store.state.mqtt[this.baseTopic + "/get/currents"];
        return Array.isArray(currents) && currents.length > 0;
      },
    },
  },
};
</script>
