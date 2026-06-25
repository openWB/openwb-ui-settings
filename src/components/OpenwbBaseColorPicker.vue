<template>
  <div class="wrapper">
    <popper>
      <template #content>
        <compact-picker
          v-model="value"
          :disable-alpha="true"
          :palette="colorPalette"
        />
      </template>
      <input
        :id="`${uid}-color-input`"
        type="button"
        class="custom-color-picker"
        :class="{ disabled: disabled || readonly }"
        :disabled="disabled"
        :readonly="readonly"
      />
    </popper>
    <openwb-base-tooltip
      v-if="defaultColor && !disabled && !readonly"
      :description="`Zurücksetzen auf Standardfarbe (${defaultColor})`"
    >
      <font-awesome-icon
        class="ml-1 clickable"
        :icon="['fas', 'rotate-left']"
        :disabled="value == defaultColor"
        @click="changed(defaultColor)"
      />
    </openwb-base-tooltip>
  </div>
</template>

<script>
import BaseSettingComponents from "./mixins/BaseSettingComponents.vue";
import { CompactPicker } from "vue-color";
import "vue-color/style.css";
import Popper from "vue3-popper";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRotateLeft as fasRotateLeft } from "@fortawesome/free-solid-svg-icons";
library.add(fasRotateLeft);

export default {
  name: "OpenwbColorPicker",
  components: {
    FontAwesomeIcon,
    Popper,
    CompactPicker,
  },
  mixins: [BaseSettingComponents],
  props: {
    modelValue: {
      type: String,
      required: false,
      default: undefined,
      validator: (value) => {
        return /^#[0-9A-F]{6}$/i.test(value);
      },
    },
    defaultColor: {
      type: String,
      required: false,
      default: undefined,
      validator: (value) => {
        return /^#[0-9A-F]{6}$/i.test(value);
      },
    },
    colorPalette: {
      type: Array,
      required: false,
      default: undefined,
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
  data() {
    return {
      showPicker: false,
    };
  },
  computed: {
    value: {
      get() {
        // return the modelValue if set, otherwise return the defaultColor or a fallback color
        return this.modelValue || this.defaultColor || "#000000";
      },
      set(newValue) {
        this.changed(newValue);
      },
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
  width: 30px;
  background-color: v-bind("value");
  padding: 0;
  border-radius: 4px;
  border: 2px solid #495057;
  cursor: pointer;
}

.custom-color-picker.disabled {
  cursor: not-allowed;
}
</style>
