<template>
  <openwb-base-heading> Einstellungen für Modul "{{ electricityTariff.name }}" </openwb-base-heading>
  <component
    :is="myComponent"
    :electricity-tariff="electricityTariff"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbElectricityTariffFallback from "./OpenwbElectricityTariffConfigFallback.vue";

export default {
  name: "OpenwbElectricityTariffProxy",
  props: {
    electricityTariff: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  computed: {
    myComponent() {
      console.debug(`loading electricity tariff cloud: ${this.electricityTariff.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.electricityTariff.type}/electricity_tariff.vue`),
        errorComponent: OpenwbElectricityTariffFallback,
      });
    },
  },
  methods: {
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
