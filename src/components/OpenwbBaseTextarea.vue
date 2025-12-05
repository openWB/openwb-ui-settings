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
                :icon="['fas', 'keyboard']"
              />
              <font-awesome-icon
                v-if="subtype == 'json'"
                :icon="['fas', 'code']"
              />
            </div>
          </div>
          <textarea
            v-if="subtype === 'json'"
            :id="`${uid}-textarea`"
            ref="jsonInput"
            v-model.lazy="value"
            class="form-control"
            v-bind="$attrs"
          />
          <textarea
            v-else
            :id="`${uid}-textarea`"
            v-model="value"
            class="form-control"
            v-bind="$attrs"
          />
          <div
            v-if="$attrs.maxlength"
            class="input-group-append"
          >
            <div class="input-group-text">
              <small class="form-text text-muted text-right"> {{ length }} / {{ $attrs.maxlength }} </small>
            </div>
          </div>
        </div>
      </div>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";
import BaseSettingComponents from "./mixins/BaseSettingComponents.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faKeyboard as fasKeyboard, faCode as fasCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasKeyboard, fasCode);

export default {
  name: "OpenwbTextareaInput",
  components: {
    OpenwbBaseSettingElement,
    FontAwesomeIcon,
  },
  mixins: [BaseSettingComponents],
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: [String, Object], required: false, default: undefined },
    subtype: {
      validator: function (value) {
        return ["text", "json"].indexOf(value) !== -1;
      },
      default: "text",
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      inputInvalid: false,
      tempValue: this.modelValue,
    };
  },
  computed: {
    value: {
      get() {
        if (this.subtype == "json") {
          if (this.inputInvalid) {
            console.debug("returning invalid JSON as String");
            return this.tempValue;
          } else {
            return JSON.stringify(this.tempValue, undefined, 2);
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
            console.warn("parsing JSON failed: " + newValue, error);
            this.inputInvalid = true;
            this.$refs.jsonInput.setCustomValidity("Ungültiger JSON Ausdruck!");
            this.tempValue = newValue;
          }
        } else {
          this.$emit("update:modelValue", newValue);
        }
      },
    },
    length: {
      get() {
        if (this.value !== undefined) {
          return this.value.length;
        } else {
          return 0;
        }
      },
    },
  },
};
</script>

<style scoped>
textarea:invalid {
  background-color: pink;
}
</style>
