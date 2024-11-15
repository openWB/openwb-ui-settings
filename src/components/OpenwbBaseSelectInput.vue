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
      <div class="w-100">
        <div class="input-group">
          <div
            v-if="$slots.prefix"
            class="input-group-prepend"
          >
            <div class="input-group-text">
              <slot name="prefix" />
            </div>
          </div>
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
          <div
            v-if="addButton"
            class="input-group-append"
          >
            <div
              class="input-group-text"
              :class="addDisabled ? 'not-clickable' : 'bg-success clickable'"
              @click="addClicked()"
            >
              <slot name="inputAdd">
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'plus']"
                />
              </slot>
            </div>
          </div>
        </div>
      </div>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus as fasPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus);

export default {
  name: "OpenwbSelectInput",
  components: {
    FontAwesomeIcon,
    OpenwbBaseSettingElement,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: {
      type: [String, Number, Array, null],
      required: false,
      default: undefined,
    },
    groups: { type: Array, required: false, default: undefined },
    options: { type: Array, required: false, default: undefined },
    notSelected: { type: String, default: undefined },
    addButton: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "input:add"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      },
    },
    addDisabled: {
      get() {
        return this.value === undefined;
      },
    },
  },
  methods: {
    addClicked() {
      if (!this.addDisabled) {
        this.$emit("input:add");
      }
    },
  },
};
</script>
