<template>
  <div class="flexible-tariff-fixed-hours">
    <openwb-base-alert subtype="info">
      Konfiguriert feste Tarifzeiten, z.b. HT, NT und Standardpreis.
    </openwb-base-alert>
    <openwb-base-number-input
      title="Standardpreis"
      :min="0"
      :step="0.001"
      :precision="1"
      required
      unit="ct/kWh"
      :model-value="value.configuration.default_price * 100"
      @update:model-value="value.configuration.default_price = parseFloat(($event / 100).toFixed(3))"
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
          <font-awesome-icon :icon="['fas', 'plus']" />
        </openwb-base-avatar>
      </template>
    </openwb-base-heading>
    <openwb-base-alert
      v-if="value.configuration.tariffs.length === 0"
      subtype="info"
    >
      Es wurde noch kein Tarif konfiguriert. Klicke auf das Plus-Symbol, um einen neuen Tarif hinzuzufügen.<br />
      Tarife ermöglichen es, Preise für unterschiedliche Zeiten zu definieren.
    </openwb-base-alert>
    <fixed-tariff
      v-for="(tariff, index) in value.configuration.tariffs"
      :key="index"
      :model-value="tariff"
      @update:model-value="value.configuration.tariffs[index] = $event"
      @delete="removeTariff(index)"
    />
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";
import FixedTariff from "./FixedTariff.vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus as fasPlus, faTrash as fasTrash } from "@fortawesome/free-solid-svg-icons";
library.add(fasPlus);
library.add(fasTrash);

export default {
  name: "FlexibleTariffFixedHours",
  components: {
    FontAwesomeIcon,
    FixedTariff,
  },
  mixins: [FlexibleTariffConfigMixin],
  computed: {
    value: {
      get() {
        return this.flexibleTariff;
      },
      set(newValue) {
        console.log("set", newValue);
        this.updateConfiguration(newValue);
      },
    },
  },
  methods: {
    addTariff() {
      this.value.configuration.tariffs.push({
        name: "Neuer Tarif",
        price: 0,
        active_times: {
          dates: [],
          times: [["", ""]],
        },
      });
    },
    removeTariff(index) {
      this.value.configuration.tariffs.splice(index, 1);
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
