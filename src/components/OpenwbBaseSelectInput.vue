<template>
  <openwb-base-setting-element>
    <template #title>{{ title }}</template>
    <template #help>
      <slot name="help"></slot>
    </template>
    <template #default>
      <div class="w-100">
        <select
          v-model="value"
          class="col form-control"
          v-bind="$attrs"
        >
          <option
            v-if="notSelected !== undefined"
            :value="undefined"
            disabled
          >
            -- {{ notSelected }} --
          </option>
          <!-- select elements without option groups -->
          <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
          <!-- option groups with options -->
          <optgroup
            v-for="group in groups"
            :key="group.label"
            :label="group.label"
          >
            <option
              v-for="option in group.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </optgroup>
        </select>
        <slot name="append" />
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
  name: "OpenwbSelectInput",
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: [String, Number, Array, null], required: false, default: undefined },
    groups: { type: Array, required: false, default: undefined },
    options: { type: Array, required: false, default: undefined },
    notSelected: { type: String, default: undefined },
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
