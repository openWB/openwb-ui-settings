<template>
  <table class="w-100">
    <colgroup>
      <col
        :span="numInputs"
        class="bg-white"
        style="border: 1px solid #dee2e6"
      />
    </colgroup>
    <thead>
      <tr>
        <th :colspan="numInputs">Eingangsmuster</th>
        <th colspan="2"></th>
      </tr>
      <tr>
        <th
          v-for="key in Object.keys(ioDevice.input.digital)"
          :key="key"
          class="input-header"
        >
          <div>{{ key }}</div>
        </th>
        <th>Erzeugungsleistung</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(pattern, patternKey) in value"
        :key="patternKey"
      >
        <td
          v-for="deviceInputKey in Object.keys(ioDevice.input.digital)"
          :key="deviceInputKey"
          class="text-center"
        >
          <font-awesome-icon
            :title="getTitle(pattern.input_matrix[deviceInputKey])"
            :icon="getIcon(pattern.input_matrix[deviceInputKey])"
            :class="getIconClass(pattern.input_matrix[deviceInputKey])"
            class="fa-fw clickable"
            size="2x"
            :transform="pattern.input_matrix[deviceInputKey] == undefined ? 'shrink-6' : null"
            :mask="pattern.input_matrix[deviceInputKey] == undefined ? ['fas', 'square'] : null"
            @click.stop.prevent="toggleInput(patternKey, deviceInputKey)"
            @mousedown.stop.prevent
            @mouseup.stop.prevent
          />
        </td>
        <td class="text-center">{{ pattern.value * 100 }} %</td>
      </tr>
    </tbody>
  </table>
  <hr />
  <openwb-base-heading title="Verhalten anwenden auf..."> Verhalten anwenden auf... </openwb-base-heading>
  <openwb-base-select-input
    title="Erzeugungsanlagen"
    not-selected="Bitte auswählen"
    :empty-value="null"
    :options="availableGenerators"
    :model-value="ioAction?.configuration.component_id"
    @update:model-value="updateConfiguration($event, 'configuration.component_id')"
  >
    <template #help>
      Bitte die Erzeugungsanlage auswählen, auf welcher das Verhalten angewendet werden soll. Es kann nur eine
      Erzeugungsanlage ausgewählt werden.
    </template>
  </openwb-base-select-input>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSquare as fasSquare,
  faQuestion as fasQuestion,
  faTrash as fasTrash,
  faPlus as fasPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare as farSquare, faSquareMinus as farSquareMinus } from "@fortawesome/free-regular-svg-icons";
library.add(fasSquare, fasQuestion, farSquare, farSquareMinus, fasTrash, fasPlus);

import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";

const states = {
  undefined: {
    value: undefined,
    icon: ["fas", "question"],
    iconClass: "text-secondary",
    title: "Nicht relevant",
    nextValue: true,
  },
  true: {
    value: true,
    icon: ["fas", "square"],
    iconClass: "",
    title: "Geschlossen",
    nextValue: false,
  },
  false: {
    value: false,
    icon: ["far", "square"],
    iconClass: "",
    title: "Offen",
    nextValue: undefined,
  },
};

export default {
  name: "IoActionPowerLevels",
  components: {
    FontAwesomeIcon,
  },
  mixins: [OpenwbIoActionConfigMixin],
  computed: {
    value: {
      get() {
        return this.ioAction.configuration.input_pattern;
      },
      set(newValue) {
        this.updateConfiguration(newValue, "configuration.input_pattern");
      },
    },
    numInputs() {
      return Object.keys(this.ioDevice.input.digital).length;
    },
    availableGenerators() {
      return this.availableComponents
        .filter((component) => component.type === "inverter")
        .map((component) => {
          return { value: component.value, text: component.text };
        });
    },
  },
  methods: {
    getIcon(input) {
      return states[input].icon;
    },
    getIconClass(input) {
      return states[input].iconClass;
    },
    getTitle(input) {
      return states[input].title;
    },
    toggleInput(patternKey, deviceInputKey) {
      const nextValue = states[this.value[patternKey].input_matrix[deviceInputKey]].nextValue;
      if (nextValue !== undefined) {
        this.value[patternKey].input_matrix[deviceInputKey] = nextValue;
      } else {
        delete this.value[patternKey].input_matrix[deviceInputKey];
      }
    },
  },
};
</script>

<style scoped>
th {
  text-align: center;
  vertical-align: bottom;
}

.input-header {
  position: relative;
  height: 6em;
}

.input-header div {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: rotate(-90deg);
  transform-origin: left center;
}
</style>
