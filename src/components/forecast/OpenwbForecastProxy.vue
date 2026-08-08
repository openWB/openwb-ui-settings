<template>
  <openwb-base-alert
    v-if="forecast.official"
    subtype="success"
  >
    Das ausgewählte Modul "{{ forecast.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    Das ausgewählte Modul "{{ forecast.name }}" wird in unserer Community gepflegt.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Modul "{{ forecast.name }}" </openwb-base-heading>
  <component
    :is="getForecastComponent()"
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
  methods: {
    getForecastComponent() {
      return defineAsyncComponent({
        loader: () => import(`./${this.forecast.type}/forecast.vue`),
        errorComponent: OpenwbForecastConfigFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
