<template>
  <openwb-base-setting-element>
    <template #title>
      <slot name="title">
        {{ title }}
      </slot>
    </template>
    <template
      v-if="$slots.help"
      #help
    >
      <slot name="help" />
    </template>
    <template #default>
      <span
        v-for="(input, index) in value"
        :key="index"
      >
        <font-awesome-icon
          :title="getTitle(input)"
          :icon="getIcon(input)"
          :class="getIconClass(input)"
          class="fa-fw clickable"
          size="2x"
          :transform="input == 'undefined' ? 'shrink-6' : null"
          :mask="input == 'undefined' ? ['fas', 'square'] : null"
          @click.stop.prevent="toggleInput(index, input)"
          @mousedown.stop.prevent
          @mouseup.stop.prevent
        />
      </span>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSquare as fasSquare, faQuestion as fasQuestion } from "@fortawesome/free-solid-svg-icons";
import { faSquare as farSquare, faSquareMinus as farSquareMinus } from "@fortawesome/free-regular-svg-icons";
library.add(fasSquare, fasQuestion, farSquare, farSquareMinus);

const state = {
  null: {
    value: null,
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
    nextValue: null,
  },
};

export default {
  name: "OpenwbIoPattern",
  components: {
    FontAwesomeIcon,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: Array, required: false, default: () => [] },
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
  },
  methods: {
    getIcon(input) {
      return state[input].icon;
    },
    getIconClass(input) {
      return state[input].iconClass;
    },
    getTitle(input) {
      return state[input].title;
    },
    toggleInput(index, input) {
      this.value[index] = state[input].nextValue;
    },
  },
};
</script>
