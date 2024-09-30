<template>
  <openwb-base-heading>
    Einstellungen für Modul "{{ electricityTariff.name }}"
  </openwb-base-heading>
  <component
    :is="myComponent"
    :electricity-tariff="electricityTariff"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import ElectricityTariffConfigMixin from "./ElectricityTariffConfigMixin.vue";
import OpenwbElectricityTariffFallback from "./OpenwbElectricityTariffConfigFallback.vue";

export default {
  name: "OpenwbElectricityTariffProxy",
  mixins: [ElectricityTariffConfigMixin],
  computed: {
    myComponent() {
      console.debug(
        `loading electricity tariff cloud: ${this.electricityTariff.type}`,
      );
      return defineAsyncComponent({
        loader: () =>
          import(
            `./${this.electricityTariff.type}/electricity_tariff.vue`
          ),
        errorComponent: OpenwbElectricityTariffFallback,
      });
    },
  },
};
</script>
