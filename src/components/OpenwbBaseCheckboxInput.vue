<template>
  <openwb-base-setting-element>
    <template #title>
      <slot name="title">
        {{ title }}
      </slot>
    </template>
    <template #help v-if="$slots.help">
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
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";

export default {
  name: "OpenwbCheckboxInput",
  inheritAttrs: false,
  components: {
    OpenwbBaseSettingElement,
  },
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: Boolean },
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
};
</script>
