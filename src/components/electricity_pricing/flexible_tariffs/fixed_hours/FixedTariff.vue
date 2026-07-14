<template>
  <openwb-base-card
    subtype="info"
    :collapsible="true"
    :collapsed="true"
  >
    <template #header>
      {{ tariff.name }}
    </template>
    <template #actions>
      <openwb-base-avatar
        class="bg-danger clickable"
        @click="$emit('delete')"
      >
        <font-awesome-icon :icon="['fas', 'trash']" />
      </openwb-base-avatar>
    </template>
    <openwb-base-text-input
      v-model="tariff.name"
      title="Tarifname"
    />
    <openwb-base-number-input
      title="Preis"
      :step="0.001"
      :precision="3"
      required
      unit="ct/kWh"
      :model-value="parseFloat((tariff.price * 100000).toFixed(4))"
      @update:model-value="tariff.price = $event / 100000"
    />
    <openwb-base-select-input
      v-model="dates"
      title="Quartale"
      required
      multiple
      :options="[
        { value: '01-01;31-03', text: '1. Quartal' },
        { value: '01-04;30-06', text: '2. Quartal' },
        { value: '01-07;30-09', text: '3. Quartal' },
        { value: '01-10;31-12', text: '4. Quartal' },
      ]"
    />
    <openwb-base-select-input
      v-model="weekdays"
      title="Aktive Wochentage"
      required
      multiple
      :options="weekdayOptions"
    />
    <time-table
      v-model="tariff.active_times.times"
      title="Aktive Zeiten"
    />
  </openwb-base-card>
</template>

<script>
import TimeTable from "./TimeTable.vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus as fasPlus, faTrash as fasTrash } from "@fortawesome/free-solid-svg-icons";
library.add(fasPlus);
library.add(fasTrash);

export default {
  name: "FixedTariff",
  components: {
    FontAwesomeIcon,
    TimeTable,
  },
  props: {
    modelValue: { type: Object, required: true },
  },
  emits: ["update:modelValue", "delete"],
  data() {
    return {
      weekdayOptions: [
        { value: 0, text: "Montag" },
        { value: 1, text: "Dienstag" },
        { value: 2, text: "Mittwoch" },
        { value: 3, text: "Donnerstag" },
        { value: 4, text: "Freitag" },
        { value: 5, text: "Samstag" },
        { value: 6, text: "Sonntag" },
      ],
    };
  },
  computed: {
    tariff: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      },
    },
    dates: {
      get() {
        if (!Array.isArray(this.tariff.active_times?.dates)) {
          return [];
        }
        // convert date array from tariff to string for select input
        // [["01-01", "31-03"], ["01-04", "30-06"]] -> ["01-01;31-03", "01-04;30-06"]
        return this.tariff.active_times.dates.map(([begin, end]) => `${begin};${end}`);
      },
      set(newValue) {
        // convert string from select input to date array for tariff
        // ["01-01;31-03", "01-04;30-06"] -> [["01-01", "31-03"], ["01-04", "30-06"]]
        this.tariff.active_times.dates = newValue.map((date) => date.split(";"));
      },
    },
    weekdays: {
      get() {
        if (!Array.isArray(this.tariff.active_times?.weekdays)) {
          return [];
        }
        return this.tariff.active_times.weekdays;
      },
      set(newValue) {
        this.tariff.active_times.weekdays = newValue;
      },
    },
  },
};
</script>
