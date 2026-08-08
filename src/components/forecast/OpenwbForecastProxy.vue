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

const FORECAST_COMPONENT_LOADERS = {
  openmeteo: () => import("./openmeteo/forecast.vue"),
  forecastsolar: () => import("./forecastsolar/forecast.vue"),
  pvnode: () => import("./pvnode/forecast.vue"),
};

const FORECAST_PROVIDER_ALIASES = {
  "forecast.solar": "forecastsolar",
  forecastsolar: "forecastsolar",
  forecast_solar: "forecastsolar",
  "open-meteo": "openmeteo",
  open_meteo: "openmeteo",
  openmeteo: "openmeteo",
  pvnode: "pvnode",
  pv_node: "pvnode",
};

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
      const lowered = trimmed.toLowerCase();
      if (FORECAST_PROVIDER_ALIASES[lowered]) {
        return FORECAST_PROVIDER_ALIASES[lowered];
      }
      const simplified = lowered.replace(/[^a-z0-9]/g, "_");
      return FORECAST_PROVIDER_ALIASES[simplified] || null;
    },
    forecastComponent() {
      const providerType = this.normalizedProviderType;
      if (!providerType) {
        return OpenwbForecastConfigFallback;
      }
      const loader = FORECAST_COMPONENT_LOADERS[providerType];
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
