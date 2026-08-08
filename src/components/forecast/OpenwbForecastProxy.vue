<template>
  <openwb-base-heading> Einstellungen für Modul "{{ forecast.name }}" </openwb-base-heading>
  <component
    :is="forecastComponent"
    :forecast="forecast"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent, markRaw } from "vue";
import OpenwbForecastConfigFallback from "./OpenwbForecastConfigFallback.vue";

export default {
  name: "OpenwbForecastProxy",
  props: {
    forecast: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  data() {
    return {
      providerComponentCache: {},
    };
  },
  computed: {
    forecastComponent() {
      const providerType = this.forecast?.type;
      if (!providerType) {
        return OpenwbForecastConfigFallback;
      }
      if (!this.providerComponentCache[providerType]) {
        this.providerComponentCache[providerType] = markRaw(
          defineAsyncComponent({
            loader: () => import(`./${providerType}/forecast.vue`),
            errorComponent: OpenwbForecastConfigFallback,
          }),
        );
      }
      return this.providerComponentCache[providerType];
    },
  },
  methods: {
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
