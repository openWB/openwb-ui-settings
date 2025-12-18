<template>
  <div class="btn-group btn-block btn-group-toggle">
    <label
      v-for="button in buttons"
      :key="button.buttonValue"
      class="btn btn-same-size btn-centered"
      :class="[
        { active: modelValue === button.buttonValue },
        { disabled: disabled },
        button.class ? button.class : 'btn-outline-info',
      ]"
      :for="`${uid}-${button.buttonValue}`"
    >
      <span>
        <input
          :id="`${uid}-${button.buttonValue}`"
          v-model="value"
          type="radio"
          :value="button.buttonValue"
          v-bind="$attrs"
          :disabled="disabled"
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

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck as fasCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheck);

export default {
  name: "OpenwbButtonRow",
  components: { FontAwesomeIcon },
  inheritAttrs: false,
  props: {
    buttons: { type: Array, required: true },
    modelValue: { type: [String, Number, Boolean], default: null },
    disabled: { type: Boolean, default: false },
    uid: { type: String, required: true },
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
