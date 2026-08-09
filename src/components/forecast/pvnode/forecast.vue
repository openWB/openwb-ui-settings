<template>
  <div>
    <openwb-base-alert subtype="info">
      PVNode wird von der Community gepflegt und liefert die Prognosewerte direkt aus der API-Response. Bitte richte
      vorher Standort und PV-Flächen auf https://pvnode.com ein und erstelle dort einen Account.
    </openwb-base-alert>
    <openwb-base-alert subtype="info">
      <strong>API-Limits:</strong> Bei kostenlosen Accounts ist nur 1 Prognoseabruf pro Tag möglich. Weitere Abrufe
      werden vom API gecacht und zählen nicht gegen das Limit. Bei kostenpflichtigen Tarifen sind mehr Abrufe pro Tag
      möglich.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Plant ID"
      required
      :model-value="forecast.configuration.plant_id"
      @update:model-value="updateConfiguration($event, 'configuration.plant_id')"
    />
    <openwb-base-text-input
      title="API Key"
      subtype="password"
      required
      :model-value="forecast.configuration.api_key"
      @update:model-value="updateConfiguration($event, 'configuration.api_key')"
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
