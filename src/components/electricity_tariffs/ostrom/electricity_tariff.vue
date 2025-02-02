<template>
  <div class="electricity-tariff-ostrom">
    <openwb-base-alert subtype="info">
      Ihre persönlichen Zugangsdaten (Client-ID und Client-Secret) erhalten Sie über das
      <a
        href="https://developer.ostrom-api.io/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ostrom Developer Portal
      </a>
      . Behandeln Sie diese Daten wie ein Passwort, da sich darüber auch persönliche Daten aus Ihrem ostrom-Account
      abfragen lassen!
    </openwb-base-alert>
    <openwb-base-text-input
      title="Client-ID"
      subtype="user"
      required
      :model-value="electricityTariff.configuration.client_id"
      @update:model-value="updateConfiguration($event, 'configuration.client_id')"
    />
    <openwb-base-text-input
      title="Client-Secret"
      subtype="password"
      required
      :model-value="electricityTariff.configuration.client_secret"
      @update:model-value="updateConfiguration($event, 'configuration.client_secret')"
    />
    <openwb-base-text-input
      title="Postleitzahl"
      :model-value="electricityTariff.configuration.zip"
      @update:model-value="updateConfiguration($event, 'configuration.zip')"
    >
      <template #help>
        Die Postleitzahl wird zur Ermittlung der Steuern, Abgaben und Umlagen benötigt. Ohne Angabe der Postleitzahl
        wird durch die ostrom API lediglich der Netto-Börsenstrompreis geliefert.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ElectricityTariffConfigMixin from "../ElectricityTariffConfigMixin.vue";

export default {
  name: "ElectricityTariffOstrom",
  mixins: [ElectricityTariffConfigMixin],
};
</script>
