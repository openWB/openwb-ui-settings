<template>
  <div class="form-row mb-1">
    <label
      class="col-md-4 col-form-label"
      @click="toggleHelp"
    >
      {{ title }}
      <font-awesome-icon
        v-if="$slots.help"
        :icon="
          showHelp
            ? ['fas', 'question-circle']
            : ['far', 'question-circle']
        "
        :class="showHelp ? 'text-info' : ''"
      />
    </label>
    <div class="col-md-8">
      <div class="form-row vaRow mb-1">
        <label
          v-if="label"
          class="col-2 col-form-label valueLabel"
        >
          {{ label }}
        </label>
        <button
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
          >
        </div>
        <button
          class="col-1 btn btn-block btn-info"
          type="button"
          @click="increment"
        >
          <font-awesome-icon :icon="['fas', 'step-forward']" />
        </button>
      </div>
      <div
        v-if="showHelp"
        class="form-row alert alert-info my-1 small"
      >
        <div class="col">
          <slot name="help" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faQuestionCircle as fasQuestionCircle,
  faStepForward as fasStepForward,
  faStepBackward as fasStepBackward,
} from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  fasQuestionCircle,
  farQuestionCircle,
  fasStepForward,
  fasStepBackward,
);

export default {
  name: "OpenwbRangeInput",
  components: {
    FontAwesomeIcon,
  },
  inheritAttrs: false,
  props: {
    title: String,
    modelValue: { type: Number },
    unit: String,
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    labels: { type: Array },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      showHelp: false,
    };
  },
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
          if (
            myValue === undefined &&
            this.modelValue !== undefined
          ) {
            console.warn(
              "sliderValue: not found in values: ",
              this.modelValue,
              "using min as default: ",
              this.min,
            );
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
    toggleHelp() {
      this.showHelp = !this.showHelp && this.$slots.help !== undefined;
    },
    increment() {
      var newSliderValue = Math.min(
        this.sliderValue + this.step,
        this.max,
      );
      // rounding needed!
      this.sliderValue =
        Math.round(newSliderValue * Math.pow(10, this.precision)) /
        Math.pow(10, this.precision);
    },
    decrement() {
      var newSliderValue = Math.max(
        this.sliderValue - this.step,
        this.min,
      );
      // rounding needed!
      this.sliderValue =
        Math.round(newSliderValue * Math.pow(10, this.precision)) /
        Math.pow(10, this.precision);
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
