<template>
  <div>
    <openwb-base-alert subtype="info">
      <p>
        PVNode wird von der Community gepflegt und liefert die Prognosewerte direkt aus der API-Response. Bitte richte
        vorher Standort und PV-Flächen auf
        <a
          href="https://pvnode.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          pvnode.com
        </a>
        ein und erstelle dort einen Account.
      </p>
      <p>
        <strong>API-Begrenzung:</strong> Bei kostenlosen Accounts ist nur 1 Prognoseabruf pro Tag möglich. Weitere
        Abrufe werden von der API mit den Daten aus dem Cache beantwortet und zählen nicht gegen das Limit. Bei
        kostenpflichtigen Tarifen sind mehr Abrufe pro Tag möglich.
      </p>
    </openwb-base-alert>
    <openwb-base-text-input
      v-model="forecastConfiguration.plant_id"
      title="Standort-ID"
      required
    >
      <template #prepend>
        <font-awesome-icon :icon="['fas', 'map-location-dot']" />
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      v-model="forecastConfiguration.api_key"
      title="API Schlüssel"
      subtype="password"
      required
    />
  </div>
</template>

<script>
import ForecastConfigMixin from "../ForecastConfigMixin.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMapLocationDot as fasMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasMapLocationDot);

export default {
  name: "PvNodeForecastConfig",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ForecastConfigMixin],
};
</script>
