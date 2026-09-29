<template>
  <openwb-base-heading> Einstellungen für Modul "{{ forecast.name }}" </openwb-base-heading>
  <component
    :is="forecastComponent"
    :forecast="forecast"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbForecastConfigFallback from "./OpenwbForecastConfigFallback.vue";

export default {
  name: "OpenwbForecastProxy",
  props: {
    forecast: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  computed: {
    forecastComponent() {
      console.debug(`loading forecast provider: ${this.forecast.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.forecast.type}/forecast.vue`),
        errorComponent: OpenwbForecastConfigFallback,
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
