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
      <div class="btn-group btn-block btn-group-toggle">
        <label
          v-for="button in buttons"
          :key="button.value"
          class="btn btn-same-size btn-centered"
          :class="[value == button.buttonValue ? 'active' : '', button.class ? button.class : 'btn-outline-info']"
        >
          <span>
            <input
              v-model="value"
              type="radio"
              :value="button.buttonValue"
              v-bind="$attrs"
              @click="$emit('button-click', button.buttonValue)"
            />
            <slot :name="'label-' + button.buttonValue">
              {{ button.text }}
            </slot>
            <span>&nbsp;</span>
            <font-awesome-icon
              :icon="['fas', 'check']"
              :style="[value == button.buttonValue ? 'visibility: visible' : 'visibility: hidden']"
            />
          </span>
        </label>
      </div>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck as fasCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheck);

export default {
  name: "OpenwbButtonGroupInput",
  components: {
    FontAwesomeIcon,
    OpenwbBaseSettingElement,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: [String, Number, Boolean], default: undefined },
    buttons: { type: Array, required: true },
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
  },
};
</script>

<style scoped>
.btn.btn-centered {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.btn.btn-same-size {
  flex-basis: 10px !important; /* make buttons the same size */
}
</style>
