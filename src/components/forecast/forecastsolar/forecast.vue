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
    <openwb-base-number-input
      title="Tilt"
      unit="Grad"
      :min="0"
      :max="90"
      :step="1"
      required
      :model-value="forecast.configuration.tilt"
      @update:model-value="updateConfiguration($event, 'configuration.tilt')"
    />
    <openwb-base-number-input
      title="Azimuth"
      unit="Grad"
      :min="-180"
      :max="180"
      :step="1"
      required
      :model-value="forecast.configuration.azimuth"
      @update:model-value="updateConfiguration($event, 'configuration.azimuth')"
    >
      <template #help> -180..180, wobei 0 = Süden, -90 = Osten, 90 = Westen. </template>
    </openwb-base-number-input>
    <openwb-base-number-input
      title="Peak Power"
      unit="kWp"
      :min="0.001"
      :step="0.01"
      required
      :model-value="forecast.configuration.peak_power_kw"
      @update:model-value="updateConfiguration($event, 'configuration.peak_power_kw')"
    />
  </div>
</template>

<script>
import ForecastConfigMixin from "../ForecastConfigMixin.vue";

export default {
  name: "ForecastSolarForecastConfig",
  mixins: [ForecastConfigMixin],
};
</script>
