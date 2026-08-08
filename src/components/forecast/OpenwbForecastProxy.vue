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

const FORECAST_COMPONENT_MODULES = import.meta.glob("./*/forecast.vue");

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
    providerComponentLoaders() {
      return Object.entries(FORECAST_COMPONENT_MODULES).reduce((loaders, [path, loader]) => {
        const match = path.match(/^\.\/([^/]+)\/forecast\.vue$/);
        if (!match) {
          return loaders;
        }
        return {
          ...loaders,
          [match[1]]: loader,
        };
      }, {});
    },
    normalizedProviderType() {
      const rawType =
        typeof this.forecast?.type === "string" && this.forecast.type.trim().length > 0
          ? this.forecast.type
          : this.forecast?.name;
      if (typeof rawType !== "string") {
        return null;
      }
      const trimmed = rawType.trim();
      if (!trimmed) {
        return null;
      }
      const loaderTypes = Object.keys(this.providerComponentLoaders);
      if (loaderTypes.includes(trimmed)) {
        return trimmed;
      }
      const lowered = trimmed.toLowerCase();
      if (loaderTypes.includes(lowered)) {
        return lowered;
      }
      const simplified = lowered.replace(/[^a-z0-9]/g, "");
      return (
        loaderTypes.find((providerType) => providerType.toLowerCase().replace(/[^a-z0-9]/g, "") === simplified) || null
      );
    },
    forecastComponent() {
      const providerType = this.normalizedProviderType;
      if (!providerType) {
        return OpenwbForecastConfigFallback;
      }
      const loader = this.providerComponentLoaders[providerType];
      if (!loader) {
        return OpenwbForecastConfigFallback;
      }
      if (!this.providerComponentCache[providerType]) {
        this.providerComponentCache[providerType] = markRaw(
          defineAsyncComponent({
            loader,
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
