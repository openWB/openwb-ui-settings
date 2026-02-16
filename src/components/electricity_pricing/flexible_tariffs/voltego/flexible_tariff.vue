<template>
  <div class="flexible-tariff-voltego">
    <openwb-base-alert subtype="info">
      Deine persönlichen Zugangsdaten (Client-ID und Client-Secret) erhältst Du direkt von Voltego. Behandle diese Daten
      wie ein Passwort, da sich darüber auch persönliche Daten aus Deinem Voltego-Account abfragen lassen!
    </openwb-base-alert>
    <openwb-base-text-input
      title="Client-ID"
      subtype="user"
      required
      :model-value="flexibleTariff.configuration.client_id"
      @update:model-value="updateConfiguration($event, 'configuration.client_id')"
    />
    <openwb-base-text-input
      title="Client-Secret"
      subtype="password"
      required
      :model-value="flexibleTariff.configuration.client_secret"
      @update:model-value="updateConfiguration($event, 'configuration.client_secret')"
    />
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffVoltego",
  mixins: [FlexibleTariffConfigMixin],
};
</script>
