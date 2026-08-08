<template>
  <div>
    <openwb-base-text-input
      title="API Key"
      subtype="password"
      required
      :model-value="forecast.configuration.api_key"
      @update:model-value="updateConfiguration($event, 'configuration.api_key')"
    />
    <openwb-base-text-input
      title="Plant ID"
      required
      :model-value="forecast.configuration.plant_id"
      @update:model-value="updateConfiguration($event, 'configuration.plant_id')"
    />
    <openwb-base-number-input
      title="Peak Power"
      unit="kWp"
      :min="0.001"
      :step="0.01"
      required
      :model-value="forecast.configuration.peak_power_kw"
      @update:model-value="updateConfiguration($event, 'configuration.peak_power_kw')"
    />
    <openwb-base-number-input
      title="System Loss"
      :min="0"
      :max="0.95"
      :step="0.01"
      required
      :model-value="forecast.configuration.system_loss"
      @update:model-value="updateConfiguration($event, 'configuration.system_loss')"
    >
      <template #help> Verlustfaktor als Dezimalzahl, z.B. 0.14 für 14%. </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ForecastConfigMixin from "../ForecastConfigMixin.vue";

export default {
  name: "PvNodeForecastConfig",
  mixins: [ForecastConfigMixin],
};
</script>
