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
      :min="0"
      :step="0.001"
      :precision="1"
      required
      unit="ct/kWh"
      :model-value="tariff.price * 100"
      @update:model-value="tariff.price = parseFloat(($event / 100).toFixed(3))"
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
  },
};
</script>
