<template>
  <openwb-base-card
    subtype="secondary"
    :collapsible="true"
    :collapsed="true"
    class="pb-0"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'tower-broadcast']"
      />
      {{ ioDevice.name }}
    </template>
    <openwb-base-card
      v-if="hasDigitalInputs"
      title="Digitale Eingänge"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div
          v-for="(value, key) in digitalInputStates"
          :key="key"
          class="col io-state"
        >
          {{ key }}:
          <font-awesome-icon
            :title="getTitle(value)"
            :icon="getIcon(value)"
            class="fa-fw"
          />
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      v-if="hasDigitalOutputs"
      title="Digitale Ausgänge"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div
          v-for="(value, key) in digitalOutputStates"
          :key="key"
          class="col io-state"
        >
          {{ key }}:
          <font-awesome-icon
            :title="getTitle(value)"
            :icon="getIcon(value)"
            class="fa-fw"
          />
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      v-if="hasAnalogInputs"
      title="Analoge Eingänge"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div
          v-for="(value, key) in analogInputStates"
          :key="key"
          class="col io-state"
        >
          {{ key }}: {{ value }}
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card
      v-if="hasAnalogOutputs"
      title="Analoge Ausgänge"
      subtype="white"
      body-bg="white"
      class="py-1 mb-2"
    >
      <div class="row">
        <div
          v-for="(value, key) in analogOutputStates"
          :key="key"
          class="col io-state"
        >
          {{ key }}: {{ value }}
        </div>
      </div>
    </openwb-base-card>
    <template #footer>
      <div class="container">
        <div class="row">
          <div class="col px-0">
            <openwb-base-alert :subtype="getFaultStateSubtype(baseTopic)">
              <font-awesome-icon
                fixed-width
                :icon="stateIcon"
              />
              Modulmeldung:
              <span style="white-space: pre-wrap">{{ $store.state.mqtt[baseTopic + "/get/fault_str"] }}</span>
            </openwb-base-alert>
          </div>
          <div class="col col-auto pr-0">
            <div class="text-right">ID: {{ ioDevice.id }}</div>
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
  faTowerBroadcast as fasTowerBroadcast,
  faSquare as fasSquare,
  faQuestion as fasQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare as farSquare, faSquareMinus as farSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  fasCheckCircle,
  fasExclamationTriangle,
  fasTimesCircle,
  fasTowerBroadcast,
  fasSquare,
  fasQuestion,
  farSquare,
  farSquareMinus,
);

export default {
  name: "IoDeviceCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    ioDevice: { type: Object, required: true },
  },
  data() {
    return {
      state: {
        true: {
          icon: ["fas", "square"],
          title: "Geschlossen",
        },
        false: {
          icon: ["far", "square"],
          title: "Offen",
        },
      },
    };
  },
  computed: {
    baseTopic: {
      get() {
        return `openWB/io/states/${this.ioDevice.id}`;
      },
    },
    faultState() {
      return this.$store.state.mqtt[`${this.baseTopic}/get/fault_state`];
    },
    faultStr() {
      return this.$store.state.mqtt[`${this.baseTopic}/get/fault_str`];
    },
    hasDigitalInputs() {
      return Object.keys(this.$store.state.mqtt[`${this.baseTopic}/get/digital_input`] || {}).length > 0;
    },
    hasDigitalOutputs() {
      return Object.keys(this.$store.state.mqtt[`${this.baseTopic}/get/digital_output`] || {}).length > 0;
    },
    hasAnalogInputs() {
      return Object.keys(this.$store.state.mqtt[`${this.baseTopic}/get/analog_input`] || {}).length > 0;
    },
    hasAnalogOutputs() {
      return Object.keys(this.$store.state.mqtt[`${this.baseTopic}/get/analog_output`] || {}).length > 0;
    },
    digitalInputStates() {
      return this.$store.state.mqtt[`${this.baseTopic}/get/digital_input`];
    },
    digitalOutputStates() {
      return this.$store.state.mqtt[`${this.baseTopic}/get/digital_output`];
    },
    analogInputStates() {
      return this.$store.state.mqtt[`${this.baseTopic}/get/analog_input`];
    },
    analogOutputStates() {
      return this.$store.state.mqtt[`${this.baseTopic}/get/analog_output`];
    },
  },
  methods: {
    getIcon(digitalState) {
      return this.state[digitalState].icon;
    },
    getTitle(digitalState) {
      return this.state[digitalState].title;
    },
  },
};
</script>

<style scoped>
.io-state {
  white-space: nowrap;
  flex-grow: 0;
  flex-basis: 7em;
}
</style>
