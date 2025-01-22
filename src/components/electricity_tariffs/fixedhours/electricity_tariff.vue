<template>
  <div class="electricity-tariff-fixedhours">
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
      :model-value="electricityTariff.configuration.default_price"
      @update:model-value="updateConfiguration(parseFloat($event.toFixed(3)), 'configuration.default_price')"
    >
      <template #help> Standardpreis sofern kein anderer Tarif aktiv ist. </template>
    </openwb-base-number-input>
    <openwb-base-card
      title="Tarife"
      subtype="info"
      :collapsible="true"
    >
      <template #header>
        <font-awesome-icon fixed-width />
        Tarife
      </template>
      <template #actions>
        <openwb-base-avatar
          class="bg-success clickable"
          @click="addTariff"
        >
          <font-awesome-icon
            fixed-width
            :icon="['fas', 'plus']"
          />
        </openwb-base-avatar>
      </template>
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
          :model-value="tariff.price"
          @update:model-value="updateTariff(parseFloat($event.toFixed(3)), index, 'price')"
        />
        <openwb-base-select-input
          title="Quartale"
          :options="[
            { value: '1', text: '1. Quartal' },
            { value: '2', text: '2. Quartal' },
            { value: '3', text: '3. Quartal' },
            { value: '4', text: '4. Quartal' },
          ]"
          :model-value="tariff.active_times.quarters"
          multiple
          @update:model-value="updateQuarters($event, index)"
        />
        Aktive Zeiten
        <openwb-base-avatar
          class="bg-success clickable"
          @click="addTime(index)"
        >
          <font-awesome-icon
            fixed-width
            :icon="['fas', 'plus']"
          />
        </openwb-base-avatar>
        <div
          v-for="(time, timeIndex) in tariff.active_times.times"
          :key="timeIndex"
          class="row"
          subtype="info"
        >
          <div class="row">
            <div class="col md-6">
              <openwb-base-select-input
                title="Start"
                not-selected="Bitte auswählen"
                :options="generateTimeOptions('00:00', '23:00')"
                :model-value="time[0]"
                @update:model-value="updateTime($event, index, timeIndex, 0)"
              />
            </div>
            <div class="col md-6">
              <openwb-base-select-input
                title="Ende"
                :options="generateTimeOptions('01:00', '24:00')"
                :model-value="time[1]"
                @update:model-value="updateTime($event, index, timeIndex, 1)"
              />
            </div>
            <div class="col md-1">
              <openwb-base-avatar
                class="bg-danger clickable"
                @click="removeTime(index, timeIndex)"
              >
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'trash']"
                />
              </openwb-base-avatar>
            </div>
          </div>
        </div>
      </openwb-base-card>
    </openwb-base-card>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus as fasPlus, faTrash as fasTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus);
library.add(fasTrash);

import ElectricityTariffConfigMixin from "../ElectricityTariffConfigMixin.vue";

export default {
  name: "ElectricityTariffFixedHours",
  components: {
    FontAwesomeIcon,
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
    updateTime(value, tariffIndex, timeIndex, fieldIndex) {
      this.electricityTariff.configuration.tariffs[tariffIndex].active_times.times[timeIndex][fieldIndex] = value;
      this.updateConfiguration(this.electricityTariff.configuration.tariffs, "configuration.tariffs");
    },
    addTariff() {
      this.electricityTariff.configuration.tariffs.push({
        name: "",
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
    addTime(tariffIndex) {
      this.electricityTariff.configuration.tariffs[tariffIndex].active_times.times.push(["", ""]);
      this.updateConfiguration(this.electricityTariff.configuration.tariffs, "configuration.tariffs");
    },
    removeTime(tariffIndex, timeIndex) {
      this.electricityTariff.configuration.tariffs[tariffIndex].active_times.times.splice(timeIndex, 1);
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
