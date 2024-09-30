<template>
  <div class="form-row mb-1">
    <label
      class="col-md-4 col-form-label"
      @click="toggleHelp"
    >
      <slot>
        {{ title }}
      </slot>
      <font-awesome-icon
        v-if="$slots.help"
        fixed-width
        :icon="
          showHelp
            ? ['fas', 'question-circle']
            : ['far', 'question-circle']
        "
        :class="showHelp ? 'text-info' : ''"
      />
    </label>
    <div class="col-md-8">
      <div class="form-row">
        <div class="btn-group btn-block btn-group-toggle">
          <label
            v-for="button in buttons"
            :key="button.value"
            class="btn"
            :class="[
              value == button.buttonValue ? 'active' : '',
              button.class ? button.class : 'btn-outline-info',
            ]"
          >
            <input
              v-model="value"
              type="radio"
              :value="button.buttonValue"
              v-bind="$attrs"
            >
            <slot :name="'label-' + button.buttonValue">
              {{ button.text }}
            </slot>
            <font-awesome-icon
              :icon="['fas', 'check']"
              :style="[
                value == button.buttonValue
                  ? 'visibility: visible'
                  : 'visibility: hidden',
              ]"
            />
          </label>
        </div>
      </div>
      <span
        v-if="showHelp"
        class="form-row alert alert-info my-1 small"
      >
        <slot name="help" />
      </span>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faQuestionCircle as fasQuestionCircle,
  faCheck as fasCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasQuestionCircle, farQuestionCircle, fasCheck);

export default {
  name: "OpenwbButtonGroupInput",
  components: {
    FontAwesomeIcon,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: [String, Number, Boolean] },
    buttons: Object,
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
