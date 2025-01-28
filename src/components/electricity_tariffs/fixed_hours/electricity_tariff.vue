<template>
  <div class="electricity-tariff-fixed-hours">
    <openwb-base-alert subtype="info">
      Konfiguriert feste Tarifzeiten, z.b. HT, NT und Standardpreis.
    </openwb-base-alert>
    <openwb-base-number-input
      title="Standardpreis"
      :min="0"
      :step="0.001"
      :precision="3"
      required
      unit="ct/kWh"
      :model-value="electricityTariff.configuration.default_price * 100"
      @update:model-value="updateConfiguration(parseFloat(($event / 100).toFixed(3)), 'configuration.default_price')"
    >
      <template #help> Standardpreis sofern kein anderer Tarif aktiv ist. </template>
    </openwb-base-number-input>
    <hr />
    <openwb-base-heading>
      Tarife
      <template #actions>
        <openwb-base-avatar
          class="bg-success clickable"
          @click.stop="addTariff"
        >
          <font-awesome-icon
            fixed-width
            :icon="['fas', 'plus']"
          />
        </openwb-base-avatar>
      </template>
    </openwb-base-heading>
    <openwb-base-alert
      v-if="electricityTariff.configuration.tariffs.length === 0"
      subtype="info"
    >
      Es wurde noch kein Tarif konfiguriert. Klicken Sie auf das Plus-Symbol um einen neuen Tarif hinzuzufügen.<br />
      Tarife ermöglichen es unterschiedliche Preise für unterschiedliche Zeiten zu definieren.
    </openwb-base-alert>
    <openwb-base-card
      v-for="(tariff, index) in electricityTariff.configuration.tariffs"
      :key="index"
      subtype="info"
      :collapsible="true"
    >
      <template #header>
        {{ tariff.name }}
      </template>
      <template #actions>
        <openwb-base-avatar
          class="bg-danger clickable"
          @click="removeTariff(index)"
        >
          <font-awesome-icon
            fixed-width
            :icon="['fas', 'trash']"
          />
        </openwb-base-avatar>
      </template>
      <openwb-base-text-input
        title="Tarifname"
        :model-value="tariff.name"
        @update:model-value="updateTariff($event, index, 'name')"
      />
      <openwb-base-number-input
        title="Preis"
        :min="0"
        :step="0.001"
        :precision="3"
        required
        unit="ct/kWh"
        :model-value="tariff.price * 100"
        @update:model-value="updateTariff(parseFloat(($event / 100).toFixed(3)), index, 'price')"
      />
      <openwb-base-select-input
        title="Quartale"
        :options="[
          { value: 1, text: '1. Quartal' },
          { value: 2, text: '2. Quartal' },
          { value: 3, text: '3. Quartal' },
          { value: 4, text: '4. Quartal' },
        ]"
        :model-value="tariff.active_times.quarters"
        multiple
        required
        @update:model-value="updateQuarters($event, index)"
      />
      <time-table
        title="Aktive Zeiten"
        :model-value="tariff.active_times.times"
      />
    </openwb-base-card>
  </div>
</template>

<script>
import ElectricityTariffConfigMixin from "../ElectricityTariffConfigMixin.vue";
import TimeTable from "./TimeTable.vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus as fasPlus, faTrash as fasTrash } from "@fortawesome/free-solid-svg-icons";
library.add(fasPlus);
library.add(fasTrash);

export default {
  name: "ElectricityTariffFixedHours",
  components: {
    FontAwesomeIcon,
    TimeTable,
  },
  mixins: [ElectricityTariffConfigMixin],
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
    updateTariff(value, index, field) {
      this.electricityTariff.configuration.tariffs[index][field] = value;
      this.updateConfiguration(this.electricityTariff.configuration.tariffs, "configuration.tariffs");
    },
    addTariff() {
      this.electricityTariff.configuration.tariffs.push({
        name: "Neuer Tarif",
        price: 0,
        active_times: {
          quarters: [],
          times: [["", ""]],
        },
      });
      this.updateConfiguration(this.electricityTariff.configuration.tariffs, "configuration.tariffs");
    },
    removeTariff(index) {
      this.electricityTariff.configuration.tariffs.splice(index, 1);
      this.updateConfiguration(this.electricityTariff.configuration.tariffs, "configuration.tariffs");
    },
    updateQuarters(value, index) {
      this.electricityTariff.configuration.tariffs[index].active_times.quarters = value;
      this.updateConfiguration(this.electricityTariff.configuration.tariffs, "configuration.tariffs");
    },
  },
};
</script>

<style scoped>
.tariffs {
  margin-top: 20px;
}
.tariff {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
.time-range {
  display: flex;
  align-items: center;
}
.time-range button {
  margin-left: 10px;
}
</style>
