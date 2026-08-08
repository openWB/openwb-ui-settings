<template>
  <div>
    <openwb-base-alert subtype="info">
      PVNode wird von der Community gepflegt und liefert die Prognosewerte direkt aus der API-Response. Bitte richte
      vorher Standort und PV-Flaechen auf https://pvnode.com ein und erstelle dort einen Account.
    </openwb-base-alert>
    <openwb-base-alert subtype="warning">
      Aus Sicherheitsgruenden werden API Key und Plant ID nach dem Speichern nicht erneut im Klartext angezeigt.
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
