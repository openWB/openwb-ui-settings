<template>
  <openwb-base-setting-element>
    <template #title>
      <slot name="title">{{ title }}</slot>
    </template>
    <template
      v-if="$slots.help"
      #help
    >
      <slot name="help" />
    </template>
    <template #default>
      <!-- Multi Row -->
      <div
        v-if="useMultiRow"
        class="btn-group-multi"
      >
        <openwb-base-button-row
          v-for="(row, index) in buttonRows"
          :key="index"
          :buttons="row"
          :uid="uid"
          :model-value="value"
          :disabled="disabled"
          v-bind="$attrs"
          @update:model-value="value = $event"
          @button-click="$emit('button-click', $event)"
        />
      </div>
      <!-- Single Row -->
      <openwb-base-button-row
        v-else
        :buttons="buttons"
        :uid="uid"
        :model-value="value"
        :disabled="disabled"
        v-bind="$attrs"
        @update:model-value="value = $event"
        @button-click="$emit('button-click', $event)"
      />
    </template>
  </openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";
import OpenwbBaseButtonRow from "./OpenwbBaseButtonRow.vue";
import BaseSettingComponents from "./mixins/BaseSettingComponents.vue";

export default {
  name: "OpenwbButtonGroupInput",
  components: {
    OpenwbBaseSettingElement,
    OpenwbBaseButtonRow,
  },
  mixins: [BaseSettingComponents],
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: [String, Number, Boolean], default: undefined },
    buttons: { type: Array, required: true },
    disabled: { type: Boolean, required: false, default: false },
    maxButtonsPerRow: { type: Number, default: null },
  },
  emits: ["update:modelValue", "button-click"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      },
    },
    useMultiRow() {
      return this.maxButtonsPerRow && this.buttons.length > this.maxButtonsPerRow;
    },
    buttonRows() {
      if (!this.useMultiRow) return [this.buttons];
      const rows = [];
      for (let i = 0; i < this.buttons.length; i += this.maxButtonsPerRow) {
        rows.push(this.buttons.slice(i, i + this.maxButtonsPerRow));
      }
      return rows;
    },
  },
};
</script>

<style scoped>
.btn-group-multi {
  width: 100%;
}

.btn-group-multi :deep(.btn-group:not(:first-child)) {
  margin-top: -1px; /* collapse shared border with row above */
}

/* Rows other than first row: remove top outer corners */
.btn-group-multi :deep(.btn-group:not(:first-child) .btn:first-child),
.btn-group-multi :deep(.btn-group:not(:first-child) .btn:last-child) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* Rows other than last row: remove bottom outer corners */
.btn-group-multi :deep(.btn-group:not(:last-child) .btn:first-child),
.btn-group-multi :deep(.btn-group:not(:last-child) .btn:last-child) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
