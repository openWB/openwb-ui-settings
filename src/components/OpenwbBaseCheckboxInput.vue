<template>
  <openwb-base-setting-element>
    <template #title>{{ title }}</template>
    <template #help>
      <slot name="help"></slot>
    </template>
    <template #default>
      <div class="col-md-8">
        <input
          v-model="value"
          class="form-control"
          type="checkbox"
          v-bind="$attrs"
        >
      </div>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faQuestionCircle as fasQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";

library.add(fasQuestionCircle, farQuestionCircle);

export default {
  name: "OpenwbCheckboxInput",
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: Boolean },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      showHelp: false,
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
  },
  methods: {
    toggleHelp() {
      this.showHelp = !this.showHelp && this.$slots.help !== undefined;
    },
  },
};
</script>
