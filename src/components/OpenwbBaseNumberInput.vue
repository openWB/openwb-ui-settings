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
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <font-awesome-icon
              fixed-width
              :icon="['fas', 'calculator']"
            />
          </div>
        </div>
        <input
          v-model.number="value"
          type="number"
          class="form-control"
          v-bind="$attrs"
        />
        <div
          v-if="unit"
          class="input-group-append"
        >
          <div class="input-group-text">
            {{ unit }}
          </div>
        </div>
      </div>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCalculator as fasCalculator } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCalculator);

export default {
  name: "OpenwbNumberInput",
  components: {
    FontAwesomeIcon,
    OpenwbBaseSettingElement,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: Number, required: false, default: undefined },
    unit: { type: String, required: false, default: undefined },
    precision: { type: Number, default: undefined },
    emptyValue: { type: [Number, null], required: false, default: null },
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        if (this.precision !== undefined) {
          return parseFloat(Math.round(this.modelValue * Math.pow(10, this.precision)) / Math.pow(10, this.precision));
        }
        return this.modelValue;
      },
      set(newValue) {
        if (isNaN(newValue) || typeof newValue != "number") {
          newValue = this.emptyValue;
        }
        this.$emit("update:modelValue", newValue);
      },
    },
  },
};
</script>

<style scoped>
input.invalid,
input:invalid {
  background-color: pink;
}

/* hide spinner buttons if input element is readonly or disabled */
/* Chrome, Safari, Edge, Opera */
input[readonly]::-webkit-outer-spin-button,
input[readonly]::-webkit-inner-spin-button,
input[disabled]::-webkit-outer-spin-button,
input[disabled]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[readonly][type="number"],
input[disabled][type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
