<template>
  <table class="w-100 mb-2">
    <colgroup>
      <col
        :span="numContacts"
        class="bg-white"
        style="border: 1px solid #dee2e6"
      />
    </colgroup>
    <thead>
      <tr>
        <th :colspan="numContacts">{{ title }}</th>
        <th
          v-if="showTestPattern"
          rowspan="2"
          class="contact-header"
        >
          <div>Prüfergebnis</div>
        </th>
        <th :colspan="enableAddDelete ? 2 : 1"></th>
      </tr>
      <tr>
        <th
          v-for="key in Object.keys(contacts)"
          :key="key"
          class="contact-header"
        >
          <div>{{ key }}</div>
        </th>
        <th>{{ actionTitle }}</th>
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
          v-for="deviceContactKey in Object.keys(contacts)"
          :key="deviceContactKey"
          class="text-center"
        >
          <openwb-base-tooltip :description="getTitle(pattern.matrix[deviceContactKey])">
            <font-awesome-icon
              :icon="getIcon(pattern.matrix[deviceContactKey])"
              :class="getIconClass(pattern.matrix[deviceContactKey])"
              class="fa-fw clickable"
              size="2x"
              :transform="pattern.matrix[deviceContactKey] == undefined ? 'shrink-6' : null"
              :mask="pattern.matrix[deviceContactKey] == undefined ? ['fas', 'square'] : null"
              @click.stop.prevent="toggleContact(patternKey, deviceContactKey)"
              @mousedown.stop.prevent
              @mouseup.stop.prevent
            />
          </openwb-base-tooltip>
        </td>
        <td
          v-if="showTestPattern"
          class="text-center"
        >
          <openwb-base-tooltip
            v-if="patternMatch(patternKey)"
            :description="'Muster passt'"
          >
            <font-awesome-icon
              :icon="['fas', 'check-circle']"
              class="text-success fa-fw"
            />
          </openwb-base-tooltip>
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
          v-for="deviceContactKey in Object.keys(contacts)"
          :key="deviceContactKey"
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
          v-for="deviceContactKey in Object.keys(contacts)"
          :key="deviceContactKey"
          class="text-center text-body"
        >
          <openwb-base-tooltip :description="getTitle(testPattern[deviceContactKey])">
            <font-awesome-icon
              :icon="getIcon(testPattern[deviceContactKey])"
              :class="getIconClass(testPattern[deviceContactKey])"
              class="fa-fw clickable"
              size="2x"
              :transform="testPattern[deviceContactKey] == undefined ? 'shrink-6' : null"
              :mask="testPattern[deviceContactKey] == undefined ? ['fas', 'square'] : null"
              @click.stop.prevent="toggleTestPattern(deviceContactKey)"
              @mousedown.stop.prevent
              @mouseup.stop.prevent
            />
          </openwb-base-tooltip>
        </td>
        <td
          class="pl-2"
          :colspan="enableAddDelete ? 3 : 2"
        >
          Simulierter Eingang
        </td>
      </tr>
    </tbody>
  </table>
  <openwb-base-button-group-input
    v-if="showCheckPattern"
    v-model="showTestPattern"
    title="Simulierter Eingang"
    :buttons="[
      { buttonValue: false, text: 'Verbergen' },
      { buttonValue: true, text: 'Anzeigen' },
    ]"
  >
    <template #help>
      Der simulierte Eingang ist eine Hilfe um zu testen, ob die Eingangsmuster zum gewünschten Verhalten passen. Ein
      grüner Haken in der Spalte "Prüfergebnis" zeigt an, dass das Eingangsmuster zum simulierten Eingang passt.
      Eingangsmuster mit unterschiedlichem Verhalten dürfen nicht gleichzeitig passen, da sonst das Verhalten nicht
      eindeutig ist.
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
  name: "IoActionContactPattern",
  components: {
    FontAwesomeIcon,
  },
  inheritAttrs: false,
  props: {
    contacts: { type: Object, required: true },
    modelValue: { type: Array, required: true },
    title: { type: String, required: false, default: "Eingangsmuster" },
    actionTitle: { type: String, required: false, default: "Verhalten" },
    enableAddDelete: { type: Boolean, default: true },
    minPatterns: { type: Number, default: 1 },
    maxPatterns: { type: Number, default: 10 },
    showCheckPattern: { type: Boolean, required: false, default: true },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      showTestPattern: false,
      testPattern: { ...this.contacts },
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
    numContacts() {
      return Object.keys(this.contacts).length;
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
    contacts() {
      this.testPattern = { ...this.contacts };
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
    getIcon(contact) {
      return states[contact].icon;
    },
    getIconClass(contact) {
      return states[contact].iconClass;
    },
    getTitle(contact) {
      return states[contact].title;
    },
    toggleContact(patternKey, deviceContactKey) {
      const nextValue = states[this.value[patternKey].matrix[deviceContactKey]].nextValue;
      if (nextValue !== undefined) {
        this.value[patternKey].matrix[deviceContactKey] = nextValue;
      } else {
        delete this.value[patternKey].matrix[deviceContactKey];
      }
    },
    toggleTestPattern(deviceContactKey) {
      this.testPattern[deviceContactKey] = !this.testPattern[deviceContactKey];
    },
    patternMatch(patternKey) {
      return Object.keys(this.value[patternKey].matrix).every((deviceContactKey) => {
        if (this.testPattern[deviceContactKey] === undefined) {
          return true;
        }
        return this.value[patternKey].matrix[deviceContactKey] === this.testPattern[deviceContactKey];
      });
    },
    deletePattern(patternKey) {
      delete this.value.splice(patternKey, 1);
    },
    addPattern() {
      this.value.push({
        matrix: {},
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

.contact-header {
  position: relative;
  height: 6em;
}

.contact-header div {
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
