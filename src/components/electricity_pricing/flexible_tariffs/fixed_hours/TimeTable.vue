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
          <select
            v-model="time[0]"
            class="form-control"
            required
            @change="updateEndOptions(index)"
          >
            <option
              value=""
              disabled
            >
              -- Bitte auswählen --
            </option>
            <option
              v-for="option in generateTimeOptions('00:00', '23:00')"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </template>
        <template #end>
          <select
            v-model="time[1]"
            class="form-control"
            required
          >
            <option
              value=""
              disabled
            >
              -- Bitte auswählen --
            </option>
            <option
              v-for="option in endOptions[index]"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
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
  data() {
    return {
      endOptions: this.modelValue.map(() => this.generateTimeOptions("01:00", "24:00")),
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
    generateTimeOptions(start, end) {
      const options = [];
      const startHour = parseInt(start.split(":")[0], 10);
      const endHour = parseInt(end.split(":")[0], 10);
      for (let hour = startHour; hour <= endHour; hour++) {
        const hourString = hour.toString().padStart(2, "0");
        const timeString = `${hourString}:00`;
        options.push({ value: timeString, text: timeString });
      }
      return options;
    },
    addTime() {
      this.value.push(["", ""]);
    },
    removeTime(timeIndex) {
      this.value.splice(timeIndex, 1);
    },
    updateEndOptions(index) {
      const startTime = this.value[index][0];
      if (startTime) {
        const startHour = parseInt(startTime.split(":")[0], 10) + 1;
        const startString = startHour.toString().padStart(2, "0") + ":00";
        this.endOptions[index] = this.generateTimeOptions(startString, "24:00");
      } else {
        this.endOptions[index] = this.generateTimeOptions("01:00", "24:00");
      }
    },
  },
};
</script>
