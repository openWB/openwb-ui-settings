<template>
  <table class="w-100 mb-2">
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
        <th
          v-if="showTestPattern"
          rowspan="2"
          class="input-header"
        >
          <div>Prüfergebnis</div>
        </th>
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
            :tooltip="addPatternTooltip"
            :disabled="addPatternDisabled"
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
        <td
          v-if="showTestPattern"
          class="text-center"
        >
          <font-awesome-icon
            title="Muster passt"
            :icon="['fas', 'check-circle']"
            class="text-success fa-fw"
            :class="{ hidden: !patternMatch(patternKey) }"
          />
        </td>
        <td v-bind="$attrs">
          <slot :pattern="pattern">{{ pattern.value }}</slot>
        </td>
        <td v-if="enableAddDelete">
          <openwb-base-click-button
            class="bg-danger text-white"
            :tooltip="deletePatternTooltip"
            :disabled="deletePatternDisabled"
            @click="deletePattern(patternKey)"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </openwb-base-click-button>
        </td>
      </tr>
      <tr v-if="showTestPattern">
        <td
          v-for="deviceInputKey in Object.keys(digitalInputs)"
          :key="deviceInputKey"
          class="pt-4"
        >
          &nbsp;
        </td>
        <td :colspan="enableAddDelete ? 3 : 2"></td>
      </tr>
      <tr
        v-if="showTestPattern"
        class="bg-info"
      >
        <td
          v-for="deviceInputKey in Object.keys(digitalInputs)"
          :key="deviceInputKey"
          class="text-center text-body"
        >
          <font-awesome-icon
            :title="getTitle(testPattern[deviceInputKey])"
            :icon="getIcon(testPattern[deviceInputKey])"
            :class="getIconClass(testPattern[deviceInputKey])"
            class="fa-fw clickable"
            size="2x"
            :transform="testPattern[deviceInputKey] == undefined ? 'shrink-6' : null"
            :mask="testPattern[deviceInputKey] == undefined ? ['fas', 'square'] : null"
            @click.stop.prevent="toggleTestPattern(deviceInputKey)"
            @mousedown.stop.prevent
            @mouseup.stop.prevent
          />
        </td>
        <td
          class="pl-2"
          :colspan="enableAddDelete ? 3 : 2"
        >
          Prüfmuster
        </td>
      </tr>
    </tbody>
  </table>
  <openwb-base-button-group-input
    v-model="showTestPattern"
    title="Prüfmuster"
    :buttons="[
      { buttonValue: false, text: 'Verbergen' },
      { buttonValue: true, text: 'Anzeigen' },
    ]"
  >
    <template #help>
      Das Prüfmuster ist eine Hilfe um zu testen, ob die Eingangsmuster zum gewünschten Verhalten passen. Ein grüner
      Haken in der Spalte "Prüfergebnis" zeigt an, dass das Eingangsmuster zu dem Prüfmuster passt. Eingangsmuster mit
      unterschiedlichem Verhalten dürfen nicht gleichzeitig passen, da sonst das Verhalten nicht eindeutig ist.
    </template>
  </openwb-base-button-group-input>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSquare as fasSquare,
  faQuestion as fasQuestion,
  faTrash as fasTrash,
  faPlus as fasPlus,
  faCheckCircle as fasCheckCircle,
  faQuestionCircle as fasQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquare as farSquare,
  faSquareMinus as farSquareMinus,
  faQuestionCircle as farQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
library.add(
  fasSquare,
  fasQuestion,
  farSquare,
  farSquareMinus,
  fasTrash,
  fasPlus,
  fasCheckCircle,
  fasQuestionCircle,
  farQuestionCircle,
);

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
    minPatterns: { type: Number, default: 1 },
    maxPatterns: { type: Number, default: 10 },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      showTestPattern: false,
      testPattern: { ...this.digitalInputs },
    };
  },
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
    addPatternDisabled() {
      return this.value.length >= this.maxPatterns;
    },
    addPatternTooltip() {
      if (this.addPatternDisabled) {
        if (this.maxPatterns === 1) {
          return "Es kann maximal ein Muster definiert werden";
        }
        return `Es können maximal ${this.maxPatterns} Muster definiert werden`;
      }
      return "Muster hinzufügen";
    },
    deletePatternDisabled() {
      return this.value.length <= this.minPatterns;
    },
    deletePatternTooltip() {
      if (this.deletePatternDisabled) {
        if (this.minPatterns === 1) {
          return "Es muss mindestens ein Muster definiert sein";
        }
        return `Es müssen mindestens ${this.minPatterns} Muster definiert sein`;
      }
      return "Muster löschen";
    },
  },
  watch: {
    digitalInputs() {
      this.testPattern = { ...this.digitalInputs };
    },
  },
  mounted() {
    while (this.value.length < this.minPatterns) {
      this.addPattern();
    }
  },
  methods: {
    toggleHelp() {
      this.showHelp = !this.showHelp;
    },
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
    toggleTestPattern(deviceInputKey) {
      this.testPattern[deviceInputKey] = !this.testPattern[deviceInputKey];
    },
    patternMatch(patternKey) {
      return Object.keys(this.value[patternKey].input_matrix).every((deviceInputKey) => {
        if (this.testPattern[deviceInputKey] === undefined) {
          return true;
        }
        return this.value[patternKey].input_matrix[deviceInputKey] === this.testPattern[deviceInputKey];
      });
    },
    deletePattern(patternKey) {
      delete this.value.splice(patternKey, 1);
    },
    addPattern() {
      this.value.push({
        input_matrix: {},
        value: null,
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

.hidden {
  visibility: hidden;
}
</style>
