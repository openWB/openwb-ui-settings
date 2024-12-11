<template>
  <openwb-base-card
    subtype="secondary"
    :collapsible="true"
    :collapsed="true"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'tower-broadcast']"
      />
      {{ ioDevice.name }}
    </template>
    <openwb-base-alert :subtype="statusLevel[faultState]">
      <font-awesome-icon
        v-if="faultState == 1"
        fixed-width
        :icon="['fas', 'exclamation-triangle']"
      />
      <font-awesome-icon
        v-else-if="faultState == 2"
        fixed-width
        :icon="['fas', 'times-circle']"
      />
      <font-awesome-icon
        v-else
        fixed-width
        :icon="['fas', 'check-circle']"
      />
      Modulmeldung:<br />
      <span style="white-space: pre-wrap">{{ faultStr }}</span>
    </openwb-base-alert>
    <openwb-base-heading v-if="hasDigitalInputs">Digitale Eingänge</openwb-base-heading>
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
    <openwb-base-heading v-if="hasDigitalOutputs">Digitale Ausgänge</openwb-base-heading>
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
    <openwb-base-heading v-if="hasAnalogInputs">Analoge Eingänge</openwb-base-heading>
    <div class="row">
      <div
        v-for="(value, key) in analogInputStates"
        :key="key"
        class="col io-state"
      >
        {{ key }}: {{ value }}
      </div>
    </div>
    <openwb-base-heading v-if="hasAnalogOutputs">Analoge Ausgänge</openwb-base-heading>
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
      statusLevel: ["success", "warning", "danger"],
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
    faultState() {
      return this.$store.state.mqtt[`openWB/io/states/${this.ioDevice.id}/get/fault_state`];
    },
    faultStr() {
      return this.$store.state.mqtt[`openWB/io/states/${this.ioDevice.id}/get/fault_str`];
    },
    hasDigitalInputs() {
      return (
        Object.keys(this.$store.state.mqtt[`openWB/io/states/${this.ioDevice.id}/get/digital_input`] || {}).length > 0
      );
    },
    hasDigitalOutputs() {
      return (
        Object.keys(this.$store.state.mqtt[`openWB/io/states/${this.ioDevice.id}/get/digital_output`] || {}).length > 0
      );
    },
    hasAnalogInputs() {
      return (
        Object.keys(this.$store.state.mqtt[`openWB/io/states/${this.ioDevice.id}/get/analog_input`] || {}).length > 0
      );
    },
    hasAnalogOutputs() {
      return (
        Object.keys(this.$store.state.mqtt[`openWB/io/states/${this.ioDevice.id}/get/analog_output`] || {}).length > 0
      );
    },
    digitalInputStates() {
      return this.$store.state.mqtt[`openWB/io/states/${this.ioDevice.id}/get/digital_input`];
    },
    digitalOutputStates() {
      return this.$store.state.mqtt[`openWB/io/states/${this.ioDevice.id}/get/digital_output`];
    },
    analogInputStates() {
      return this.$store.state.mqtt[`openWB/io/states/${this.ioDevice.id}/get/analog_input`];
    },
    analogOutputStates() {
      return this.$store.state.mqtt[`openWB/io/states/${this.ioDevice.id}/get/analog_output`];
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
