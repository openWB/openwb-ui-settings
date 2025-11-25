<template>
  <div class="wrapper">
    <input
      :id="`${uid}-color-input`"
      type="color"
      class="custom-color-picker"
      :value="modelValue"
      :title="`Farbe: ${modelValue}`"
      @input="changed($event.target.value)"
    />
    <font-awesome-icon
      v-if="defaultColor"
      class="ml-1 clickable"
      :icon="['fas', 'rotate-left']"
      :title="`Zurücksetzen auf Standardfarbe (${defaultColor})`"
      @click="changed(defaultColor)"
    />
  </div>
</template>

<script>
import BaseSettingComponents from "./mixins/BaseSettingComponents.vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRotateLeft as fasRotateLeft } from "@fortawesome/free-solid-svg-icons";
library.add(fasRotateLeft);

export default {
  name: "OpenwbColorPicker",
  components: {
    FontAwesomeIcon,
  },
  mixins: [BaseSettingComponents],
  props: {
    defaultColor: {
      type: String,
      required: false,
      default: undefined,
      validator: (value) => {
        return /^#[0-9A-F]{6}$/i.test(value);
      },
    },
    modelValue: {
      type: String,
      required: false,
      default: "#000000",
      validator: (value) => {
        return /^#[0-9A-F]{6}$/i.test(value);
      },
    },
  },
  emits: ["update:model-value"],
  methods: {
    changed(event) {
      this.$emit("update:model-value", event);
    },
  },
};
</script>

<style scoped>
.wrapper {
  height: 100%;
  display: flex;
  align-items: center;
}
.custom-color-picker {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 30px;
  height: 100%;
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}
.custom-color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
  margin: 0;
}
.custom-color-picker::-webkit-color-swatch {
  border-radius: 4px;
  border: 2px solid #495057;
}
.custom-color-picker::-moz-color-swatch {
  border-radius: 4px;
  border: 2px solid #495057;
}
</style>
