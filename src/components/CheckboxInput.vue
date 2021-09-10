<template>
  <div class="form-row mb-1">
    <label v-on:click="toggleHelp" class="col-md-4 col-form-label">
      {{ title }}
      <font-awesome-icon
        v-if="$slots.help"
        :icon="
          showHelp ? ['fas', 'question-circle'] : ['far', 'question-circle']
        "
        :class="showHelp ? 'text-info' : ''"
      />
    </label>
    <div class="col-md-8">
      <div class="form-row">
        <input
          class="form-control"
          type="checkbox"
          v-model="value"
          v-bind="$attrs"
        />
      </div>
      <span v-if="showHelp" class="form-row alert alert-info my-1 small">
        <slot name="help"></slot>
      </span>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faQuestionCircle as fasQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasQuestionCircle, farQuestionCircle);

export default {
  name: "CheckboxInput",
  inheritAttrs: false,
  props: {
    title: String,
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
  components: {
    FontAwesomeIcon,
  },
};
</script>
