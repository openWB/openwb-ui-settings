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
        <div class="vaRow mb-1 w-100">
          <label
            v-if="label"
            class="col-2 pl-0 col-form-label valueLabel"
            :for="`${uid}-button`"
          >
            {{ label }}
          </label>
          <button
            :id="`${uid}-button`"
            class="col-1 btn btn-block btn-info"
            type="button"
            @click="decrement"
          >
            <font-awesome-icon :icon="['fas', 'step-backward']" />
          </button>
          <div class="col">
            <input
              v-model.number="sliderValue"
              type="range"
              class="form-control-range rangeInput"
              :min="min"
              :max="max"
              :step="step"
              v-bind="$attrs"
            />
          </div>
          <button
            class="col-1 btn btn-block btn-info"
            type="button"
            @click="increment"
          >
            <font-awesome-icon :icon="['fas', 'step-forward']" />
          </button>
        </div>
      </div>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";
import BaseSettingComponents from "./mixins/BaseSettingComponents.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faStepForward as fasStepForward, faStepBackward as fasStepBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasStepForward, fasStepBackward);

export default {
  name: "OpenwbRangeInput",
  components: {
    FontAwesomeIcon,
    OpenwbBaseSettingElement,
  },
  mixins: [BaseSettingComponents],
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: Number, required: false, default: undefined },
    unit: { type: String, required: false, default: undefined },
    min: { type: Number, required: true, default: 0 },
    max: { type: Number, required: true, default: 100 },
    step: { type: Number, required: false, default: 1 },
    labels: { type: Array, required: false, default: undefined },
  },
  emits: ["update:modelValue"],
  computed: {
    label() {
      var currentLabel;
      if (this.labels && this.sliderValue != undefined) {
        if (this.sliderValue < this.labels.length) {
          currentLabel = this.labels[this.sliderValue].label;
        } else {
          console.error("index out of bounds: " + this.sliderValue);
        }
      } else {
        currentLabel = this.sliderValue;
      }
      if (typeof currentLabel == "number") {
        currentLabel = currentLabel.toLocaleString(undefined, {
          minimumFractionDigits: this.precision,
          maximumFractionDigits: this.precision,
        });
        if (this.unit) {
          currentLabel += " " + this.unit;
        }
      }
      return currentLabel;
    },
    precision() {
      if (!isFinite(this.step)) return 0;
      var e = 1,
        p = 0;
      while (Math.round(this.step * e) / e !== this.step) {
        e *= 10;
        p++;
      }
      return p;
    },
    sliderValue: {
      get() {
        if (this.labels) {
          var myValue = undefined;
          for (let index = 0; index < this.labels.length; index++) {
            if (this.labels[index].value == this.modelValue) {
              myValue = index;
              break;
            }
          }
          if (myValue === undefined && this.modelValue !== undefined) {
            console.warn("sliderValue: not found in values: ", this.modelValue, "using min as default: ", this.min);
            return this.min;
          } else {
            return myValue;
          }
        }
        return this.modelValue;
      },
      set(newSliderValue) {
        if (this.labels) {
          var myValue = this.labels[newSliderValue].value;
          this.$emit("update:modelValue", myValue);
        } else {
          this.$emit("update:modelValue", newSliderValue);
        }
      },
    },
  },
  methods: {
    increment() {
      var newSliderValue = Math.min(this.sliderValue + this.step, this.max);
      // rounding needed!
      this.sliderValue = Math.round(newSliderValue * Math.pow(10, this.precision)) / Math.pow(10, this.precision);
    },
    decrement() {
      var newSliderValue = Math.max(this.sliderValue - this.step, this.min);
      // rounding needed!
      this.sliderValue = Math.round(newSliderValue * Math.pow(10, this.precision)) / Math.pow(10, this.precision);
    },
  },
};
</script>

<style scoped>
.vaRow {
  /* vertical alignment of content in rows */
  display: flex;
  align-items: center;
}
</style>
