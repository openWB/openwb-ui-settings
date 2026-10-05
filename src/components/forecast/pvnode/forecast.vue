<template>
  <div>
    <openwb-base-alert subtype="info">
      <p>
        PVNode wird von der Community gepflegt und liefert die Prognosewerte direkt aus der API-Response. Bitte richte
        vorher Standort und PV-Flächen auf https://pvnode.com ein und erstelle dort einen Account.
      </p>
      <p>
        <strong>API-Limits:</strong> Bei kostenlosen Accounts ist nur 1 Prognoseabruf pro Tag möglich. Weitere Abrufe
        werden von der API mit den Daten aus dem Cache beantwortet und zählen nicht gegen das Limit. Bei
        kostenpflichtigen Tarifen sind mehr Abrufe pro Tag möglich.
      </p>
    </openwb-base-alert>
    <openwb-base-text-input
      v-model="forecastConfiguration.plant_id"
      title="Plant ID"
      required
    />
    <openwb-base-text-input
      v-model="forecastConfiguration.api_key"
      title="API Key"
      subtype="password"
      required
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
