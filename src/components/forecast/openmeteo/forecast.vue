<template>
  <div>
    <openwb-base-number-input
      title="Latitude"
      :step="0.000001"
      required
      :model-value="forecast.configuration.latitude"
      @update:model-value="updateConfiguration($event, 'configuration.latitude')"
    />
    <openwb-base-number-input
      title="Longitude"
      :step="0.000001"
      required
      :model-value="forecast.configuration.longitude"
      @update:model-value="updateConfiguration($event, 'configuration.longitude')"
    />
    <openwb-base-text-input
      title="Timezone"
      required
      :model-value="forecast.configuration.timezone"
      @update:model-value="updateConfiguration($event, 'configuration.timezone')"
    >
      <template #help> Beispiel: Europe/Berlin </template>
    </openwb-base-text-input>
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
    <openwb-base-number-input
      title="Irradiance to Power Factor"
      :min="0.01"
      :step="0.01"
      required
      :model-value="forecast.configuration.irradiance_to_power_factor"
      @update:model-value="updateConfiguration($event, 'configuration.irradiance_to_power_factor')"
    />
  </div>
</template>

<script>
import ForecastConfigMixin from "../ForecastConfigMixin.vue";

export default {
  name: "OpenMeteoForecastConfig",
  mixins: [ForecastConfigMixin],
};
</script>
