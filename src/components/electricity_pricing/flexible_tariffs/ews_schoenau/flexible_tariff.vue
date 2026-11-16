<template>
  <div class="flexible-tariff-ews-schoenau">
    <openwb-base-alert subtype="info">
      Den API-Key für "Ökostrom Dynamisch" erhältst Du auf Anfrage per E-Mail an
      <a href="mailto:api@ews-schoenau.de">api@ews-schoenau.de</a>
      . Behandle den API-Key wie ein Passwort.
    </openwb-base-alert>
    <openwb-base-text-input
      title="API-Key"
      subtype="password"
      required
      :model-value="flexibleTariff.configuration.api_key"
      @update:model-value="updateConfiguration($event, 'configuration.api_key')"
    />
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffEwsSchoenau",
  mixins: [FlexibleTariffConfigMixin],
};
</script>
