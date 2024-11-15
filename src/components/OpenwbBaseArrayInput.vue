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
              <slot name="input-prefix">
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'tag']"
                />
              </slot>
            </div>
          </div>
          <input
            ref="tagInput"
            v-model="newTag"
            type="text"
            class="form-control"
            v-bind="$attrs"
            @keyup.enter="addTag"
          />
          <div class="input-group-append">
            <div
              class="input-group-text"
              :class="newTagValid ? 'bg-success clickable' : 'not-clickable'"
              @click="addTag"
            >
              <slot name="input-add">
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'plus']"
                />
              </slot>
            </div>
          </div>
        </div>
      </div>
      <div class="tagList mt-1 w-100">
        <span
          v-if="value.length == 0"
          class="noTag"
        >
          <font-awesome-icon :icon="['fas', 'info-circle']" />
          {{ noElementsMessage }}
        </span>
        <span
          v-for="(tag, index) in value"
          :key="index"
          class="tag"
        >
          <slot name="element-prefix">
            <font-awesome-icon :icon="['fas', 'tag']" />
          </slot>
          {{ tag }}
          <font-awesome-icon
            class="clickable remove-element"
            :icon="['fas', 'times-circle']"
            @click="removeTag(index)"
          />
        </span>
      </div>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTag as fasTag,
  faTimesCircle as fasTimesCircle,
  faPlus as fasPlus,
  faInfoCircle as fasInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasTag, fasTimesCircle, fasPlus, fasInfoCircle);

export default {
  name: "OpenwbArrayInput",
  components: {
    FontAwesomeIcon,
    OpenwbBaseSettingElement,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, required: true, default: "#TITLE#" },
    modelValue: {
      type: Array,
      default: () => {
        return [];
      },
    },
    noElementsMessage: {
      type: String,
      default: () => {
        return "Keine Elemente zugeordnet.";
      },
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      newTag: "",
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
    newTagValid: {
      get() {
        return this.newTag.length > 0 && !this.value.includes(this.newTag);
      },
    },
  },
  methods: {
    addTag() {
      if (this.newTagValid) {
        const tempValue = [...this.value, this.newTag].sort();
        this.value = tempValue;
        this.newTag = "";
      }
      this.$refs.tagInput.focus();
    },
    removeTag(index) {
      let tempValue = [...this.value];
      tempValue.splice(index, 1);
      this.value = tempValue;
    },
  },
};
</script>

<style scoped>
.remove-element:hover {
  color: var(--danger);
}

input.invalid,
input:invalid {
  border: 2px solid var(--danger);
}

.tagList {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 5px 5px 0 5px;
  display: flex;
  flex-wrap: wrap;
}

.tag,
.noTag {
  border-radius: 10px;
  padding: 2px 5px;
  margin-right: 10px;
  margin-bottom: 5px;
}

.noTag {
  color: var(--gray);
  font-style: italic;
}

.tag {
  background-color: var(--success);
}
</style>
