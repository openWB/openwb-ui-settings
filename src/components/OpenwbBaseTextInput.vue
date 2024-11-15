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
          <div class="input-group-prepend">
            <div class="input-group-text">
              <font-awesome-icon
                v-if="subtype == 'text'"
                fixed-width
                :icon="['fas', 'keyboard']"
              />
              <font-awesome-icon
                v-if="subtype == 'email'"
                fixed-width
                :icon="['fas', 'envelope']"
              />
              <font-awesome-icon
                v-if="subtype == 'host'"
                fixed-width
                :icon="['fas', 'network-wired']"
              />
              <font-awesome-icon
                v-if="subtype == 'url'"
                fixed-width
                :icon="['fas', 'globe']"
              />
              <font-awesome-icon
                v-if="subtype == 'user'"
                fixed-width
                :icon="['fas', 'user']"
              />
              <font-awesome-icon
                v-if="subtype == 'json'"
                fixed-width
                :icon="['fas', 'code']"
              />
              <font-awesome-icon
                v-if="subtype == 'password'"
                fixed-width
                :icon="showPassword ? ['fas', 'unlock'] : ['fas', 'lock']"
              />
              <font-awesome-icon
                v-if="subtype == 'time'"
                fixed-width
                :icon="['fas', 'clock']"
              />
              <font-awesome-icon
                v-if="subtype == 'date' || subtype == 'month' || subtype == 'year'"
                fixed-width
                :icon="['fas', 'calendar-day']"
              />
            </div>
          </div>
          <input
            v-if="['text', 'user'].includes(subtype)"
            ref="textInput"
            v-model="value"
            type="text"
            class="form-control"
            :class="{ invalid: inputInvalid }"
            v-bind="$attrs"
            :pattern="pattern"
          />
          <input
            v-if="subtype == 'json'"
            ref="jsonInput"
            v-model="value"
            type="text"
            class="form-control"
            v-bind="$attrs"
            :pattern="pattern"
          />
          <input
            v-if="subtype == 'password'"
            ref="passwordInput"
            v-model="value"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            v-bind="$attrs"
            :pattern="pattern"
          />
          <input
            v-if="subtype == 'host'"
            ref="hostInput"
            v-model="value"
            type="text"
            class="form-control"
            v-bind="$attrs"
          />
          <input
            v-if="['email', 'url'].includes(subtype)"
            v-model="value"
            refs="urlInput"
            :type="subtype"
            class="form-control"
            v-bind="$attrs"
          />
          <input
            v-if="subtype == 'time'"
            ref="timeInput"
            v-model="value"
            type="time"
            class="form-control"
            v-bind="$attrs"
          />
          <input
            v-if="subtype == 'date'"
            ref="dateInput"
            v-model="value"
            type="date"
            class="form-control"
            v-bind="$attrs"
          />
          <input
            v-if="subtype == 'month'"
            ref="monthInput"
            v-model="value"
            type="month"
            class="form-control"
            v-bind="$attrs"
          />
          <input
            v-if="subtype == 'year'"
            ref="yearInput"
            v-model="value"
            type="number"
            class="form-control"
            v-bind="$attrs"
          />
          <div
            v-if="unit"
            class="input-group-append"
          >
            <div class="input-group-text">
              {{ unit }}
            </div>
          </div>
          <div
            v-if="subtype == 'password'"
            class="input-group-append clickable"
            @click="togglePassword"
          >
            <div class="input-group-text">
              <font-awesome-icon
                fixed-width
                :icon="showPassword ? ['far', 'eye'] : ['far', 'eye-slash']"
              />
            </div>
          </div>
          <div
            v-if="showQuickButtons && (subtype == 'date' || subtype == 'month' || subtype == 'year')"
            class="input-group-append clickable"
            @click="modify(-1)"
          >
            <div class="input-group-text">-</div>
          </div>
          <div
            v-if="showQuickButtons && (subtype == 'date' || subtype == 'month' || subtype == 'year')"
            class="input-group-append clickable"
            @click="modify(1)"
          >
            <div class="input-group-text">+</div>
          </div>
        </div>
      </div>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faKeyboard as fasKeyboard,
  faEnvelope as fasEnvelope,
  faNetworkWired as fasNetworkWired,
  faGlobe as fasGlobe,
  faUser as fasUser,
  faCode as fasCode,
  faLock as fasLock,
  faUnlock as fasUnlock,
  faClock as fasClock,
  faCalendarDay as fasCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { faEye as farEye, faEyeSlash as farEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  fasKeyboard,
  fasEnvelope,
  fasNetworkWired,
  fasGlobe,
  fasUser,
  fasCode,
  fasLock,
  fasUnlock,
  fasClock,
  fasCalendarDay,
  farEye,
  farEyeSlash,
);

export default {
  name: "OpenwbTextInput",
  components: {
    FontAwesomeIcon,
    OpenwbBaseSettingElement,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: [String, Object], required: false, default: undefined },
    subtype: {
      validator: function (value) {
        return (
          ["text", "email", "host", "url", "user", "json", "password", "time", "date", "month", "year"].indexOf(
            value,
          ) !== -1
        );
      },
      default: "text",
    },
    pattern: { type: String, required: false, default: undefined },
    unit: { type: String, required: false, default: undefined },
    emptyValue: {
      type: [String, Object, null],
      required: false,
      default: null,
    },
    showQuickButtons: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      showPassword: false,
      inputInvalid: false,
      tempValue: this.modelValue,
    };
  },
  computed: {
    value: {
      get() {
        if (this.subtype == "json") {
          if (this.inputInvalid) {
            console.warn("returning invalid String");
            return this.tempValue;
          } else {
            return JSON.stringify(this.tempValue);
          }
        }
        return this.modelValue;
      },
      set(newValue) {
        if (this.subtype == "json") {
          try {
            let myNewJsonValue = JSON.parse(newValue);
            this.inputInvalid = false;
            this.$refs.jsonInput.setCustomValidity("");
            this.tempValue = myNewJsonValue;
            this.$emit("update:modelValue", myNewJsonValue);
          } catch (error) {
            console.error("parsing JSON failed: " + newValue, error);
            this.inputInvalid = true;
            this.$refs.jsonInput.setCustomValidity("Ungültiger JSON Ausdruck!");
            this.tempValue = newValue;
          }
        } else {
          if (newValue == "") {
            newValue = this.emptyValue;
          }
          this.$emit("update:modelValue", newValue);
        }
      },
    },
    inputRef() {
      switch (this.subtype) {
        case "json":
          return this.$refs.jsonInput;
        case "password":
          return this.$refs.passwordInput;
        case "host":
          return this.$refs.hostInput;
        case "email":
        case "url":
          return this.$refs.urlInput;
        case "time":
          return this.$refs.timeInput;
        case "date":
          return this.$refs.dateInput;
        case "month":
          return this.$refs.monthInput;
        case "year":
          return this.$refs.yearInput;
      }
      // default to textInput
      return this.$refs.textInput;
    },
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    modify(offset) {
      var newValue;
      var newDate = new Date(this.modelValue);
      switch (this.subtype) {
        case "date":
          newDate.setDate(newDate.getDate() + offset);
          newValue =
            String(newDate.getFullYear()) +
            "-" +
            String(newDate.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(newDate.getDate()).padStart(2, "0");
          break;
        case "month":
          newDate.setMonth(newDate.getMonth() + offset);
          newValue = String(newDate.getFullYear()) + "-" + String(newDate.getMonth() + 1).padStart(2, "0");
          break;
        case "year":
          newDate.setYear(newDate.getFullYear() + offset);
          newValue = String(newDate.getFullYear());
          break;
        default:
          console.warn(`cannot modify input of subtype '${this.subtype}'`);
          return;
      }
      if (newValue > this.inputRef.max || newValue < this.inputRef.min) {
        return;
      }
      this.value = newValue;
    },
  },
};
</script>

<style scoped>
input:invalid {
  background-color: pink;
}
</style>
