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
      <openwb-base-click-button
        :class="(disabled ? 'btn-outline-' : 'btn-') + subtype"
        :disabled="disabled"
        v-bind="$attrs"
        @button-clicked="handleClick"
      >
        {{ buttonText }}
      </openwb-base-click-button>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";
import OpenwbBaseClickButton from "./OpenwbBaseClickButton.vue";

export default {
  name: "OpenwbButtonInput",
  components: {
    OpenwbBaseSettingElement,
    OpenwbBaseClickButton,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    buttonText: { type: String, required: false, default: undefined },
    disabled: { type: Boolean, default: false },
    subtype: {
      type: String,
      validator: function (value) {
        return ["info", "success", "warning", "danger", "primary", "secondary", "light", "dark"].indexOf(value) !== -1;
      },
      default: "secondary",
    },
  },
  emits: ["buttonClicked"],
  methods: {
    handleClick(event) {
      this.$emit("buttonClicked", event);
    },
  },
};
</script>
