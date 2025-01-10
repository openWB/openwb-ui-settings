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
        <th :colspan="enableAddDelete ? 2 : 1"></th>
      </tr>
      <tr>
        <th
          v-for="key in Object.keys(digitalInputs)"
          :key="key"
          class="input-header"
        >
          <div>{{ key }}</div>
        </th>
        <th>Verhalten</th>
        <th v-if="enableAddDelete">
          <openwb-base-click-button
            class="bg-success text-white"
            tooltip="Muster hinzufügen"
            @click="addPattern()"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
          </openwb-base-click-button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(pattern, patternKey) in value"
        :key="patternKey"
      >
        <td
          v-for="deviceInputKey in Object.keys(digitalInputs)"
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
        <td v-bind="$attrs">
          <slot :pattern="pattern">{{ pattern.value }}</slot>
        </td>
        <td v-if="enableAddDelete">
          <openwb-base-click-button
            class="bg-danger text-white"
            tooltip="Muster löschen"
            @click="deletePattern(patternKey)"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </openwb-base-click-button>
        </td>
      </tr>
    </tbody>
  </table>
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
  name: "IoActionInputPattern",
  components: {
    FontAwesomeIcon,
  },
  inheritAttrs: false,
  props: {
    digitalInputs: { type: Object, required: true },
    modelValue: { type: Array, required: true },
    enableAddDelete: { type: Boolean, default: true },
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      },
    },
    numInputs() {
      return Object.keys(this.digitalInputs).length;
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
    deletePattern(patternKey) {
      delete this.value.splice(patternKey, 1);
    },
    addPattern() {
      this.value.push({
        input_matrix: {},
        value: 1,
      });
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
