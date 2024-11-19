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
    <openwb-nested-list
      v-if="value !== undefined"
      v-model="value"
      :labels="labels"
    />
    <div v-else>Warte auf Daten...</div>
  </openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";
import OpenwbNestedList from "./OpenwbNestedList.vue";

export default {
  name: "OpenwbSortableList",
  components: {
    OpenwbBaseSettingElement,
    OpenwbNestedList,
  },
  props: {
    id: { type: String, required: false, default: undefined },
    title: { type: String, required: false, default: "" },
    modelValue: { type: Array, required: false, default: undefined },
    labels: { type: Object, default: undefined },
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        console.debug("update in sortableList", newValue);
        this.$emit("update:modelValue", newValue);
      },
    },
  },
};
</script>
