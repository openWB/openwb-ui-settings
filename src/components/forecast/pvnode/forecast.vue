<template>
  <div>
    <openwb-base-alert subtype="info">
      PVNode liefert die Prognoseleistung direkt aus dem API-Response. Es sind keine lokalen Verlust- oder
      Skalierungsparameter erforderlich.
    </openwb-base-alert>
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
  </div>
</template>

<script>
import ForecastConfigMixin from "../ForecastConfigMixin.vue";

export default {
  name: "PvNodeForecastConfig",
  mixins: [ForecastConfigMixin],
};
</script>
