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
    <div class="input-group">
      <div
        v-if="showPriority && value !== undefined"
        class="input-group-prepend"
      >
        <div class="input-group-text priority-arrow">
          <span class="priority-arrow-shaft" />
          <span class="priority-arrow-head" />
        </div>
      </div>
      <openwb-nested-list
        v-if="value !== undefined"
        v-model="value"
        class="form-control variable-height"
        :labels="labels"
        :linked-meters="linkedMeters"
        :hidden-ids="hiddenIds"
        :nesting="nesting"
        :max-nesting-depth="maxNestingDepth"
        :show-priority="showPriority"
        @delete-group="$emit('delete-group', $event)"
        @rename-group="$emit('rename-group', $event)"
      />
      <div v-else>Warte auf Daten...</div>
    </div>
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
    linkedMeters: { type: Object, default: undefined },
    hiddenIds: { type: Array, default: undefined },
    nesting: { type: Boolean, default: true },
    maxNestingDepth: { type: Number, default: Infinity },
    showPriority: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "delete-group", "rename-group"],
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
};
</script>

<style scoped>
.form-control.variable-height {
  height: auto;
}

.priority-arrow {
  display: flex;
  flex: 0 0 22px;
  flex-direction: column;
  align-items: center;
}

.priority-arrow-head {
  width: 0;
  height: 0;
  border-right: 10px solid transparent;
  border-top: 13px solid var(--dark);
  border-left: 10px solid transparent;
}

.priority-arrow-shaft {
  width: 100%;
  clip-path: polygon(16% 0, 84% 0, 66% 100%, 34% 100%);
  background: var(--dark);
  flex: 1 1 auto;
}

:deep(.dragArea) {
  flex: 1 1 0;
  min-width: 0;
}

@media (max-width: 575px) {
  .priority-arrow {
    display: none;
  }
}
</style>
