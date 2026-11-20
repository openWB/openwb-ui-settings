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
      <time-row>
        <template #start> Beginn </template>
        <template #end> Ende </template>
        <template #action>
          <openwb-base-avatar
            class="bg-success clickable"
            title="Zeitbereich hinzufügen"
            @click.stop="addTime"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
          </openwb-base-avatar>
        </template>
      </time-row>
      <div
        v-if="value.length === 0"
        class="w-100 alert alert-danger"
      >
        Keine Zeitbereiche definiert!
      </div>
      <time-row
        v-for="(time, index) in value"
        :key="index"
      >
        <template #start>
          <time-select
            v-model="time[0]"
            @update:model-value="clearEndIfNotAfterStart(time)"
          />
        </template>
        <template #end>
          <time-select
            v-model="time[1]"
            :after="time[0]"
            :max-hour="24"
          />
        </template>
        <template #action>
          <openwb-base-avatar
            v-if="value.length > 1"
            class="bg-danger clickable"
            title="Zeitbereich entfernen"
            @click.stop="removeTime(index)"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </openwb-base-avatar>
        </template>
      </time-row>
    </template>
  </openwb-base-setting-element>
</template>

<script>
import TimeRow from "./TimeRow.vue";
import TimeSelect from "./TimeSelect.vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus as fasPlus, faTrash as fasTrash } from "@fortawesome/free-solid-svg-icons";
library.add(fasPlus);
library.add(fasTrash);

export default {
  name: "TimeTable",
  components: {
    FontAwesomeIcon,
    TimeRow,
    TimeSelect,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, required: true },
    modelValue: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  emits: ["update:modelValue"],
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
    addTime() {
      this.value.push(["", ""]);
    },
    removeTime(timeIndex) {
      this.value.splice(timeIndex, 1);
    },
    clearEndIfNotAfterStart(time) {
      if (time[1] <= time[0]) {
        time[1] = "";
      }
    },
  },
};
</script>
