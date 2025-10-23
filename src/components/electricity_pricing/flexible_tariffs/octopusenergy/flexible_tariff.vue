<template>
  <div class="flexible-tariff-octopusenergy">
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      required
      :model-value="flexibleTariff.configuration.email"
      @update:model-value="updateConfiguration($event, 'configuration.email')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="flexibleTariff.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
    <openwb-base-text-input
      title="Vertragsnummer (beginnt mit A-)"
      required
      :model-value="flexibleTariff.configuration.accountId"
      @update:model-value="updateConfiguration($event, 'configuration.accountId')"
    />
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffOctopusEnergy",
  mixins: [FlexibleTariffConfigMixin],
};
</script>
