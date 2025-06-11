<template>
  <div class="wrapper">
    <input
      type="color"
      class="custom-color-picker"
      :class="{ disabled: disabled || readonly }"
      :value="value"
      :title="`Farbe: ${value}`"
      :disabled="disabled"
      :readonly="readonly"
      @input="changed($event.target.value)"
    />
    <font-awesome-icon
      v-if="defaultColor && !disabled && !readonly"
      class="ml-1 clickable"
      :icon="['fas', 'rotate-left']"
      :title="`Zurücksetzen auf Standardfarbe (${defaultColor})`"
      :disabled="value == defaultColor"
      @click="changed(defaultColor)"
    />
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRotateLeft as fasRotateLeft } from "@fortawesome/free-solid-svg-icons";
library.add(fasRotateLeft);

export default {
  name: "OpenwbColorPicker",
  components: {
    FontAwesomeIcon,
  },
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
      default: undefined,
      validator: (value) => {
        return /^#[0-9A-F]{6}$/i.test(value);
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["update:model-value"],
  computed: {
    value() {
      // return the modelValue if set, otherwise return the defaultColor or a fallback color
      return this.modelValue || this.defaultColor || "#000000";
    },
  },
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

.custom-color-picker.disabled {
  cursor: not-allowed;
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
