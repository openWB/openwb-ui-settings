<template>
  <div class="electricity-tariff-octopusenergy">
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      required
      :model-value="electricityTariff.configuration.email"
      @update:model-value="updateConfiguration($event, 'configuration.email')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="electricityTariff.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
    <openwb-base-text-input
      title="Vertragsnummer (beginnt mit A-)"
      required
      :model-value="electricityTariff.configuration.accountId"
      @update:model-value="updateConfiguration($event, 'configuration.accountId')"
    />
  </div>
</template>

<script>
import ElectricityTariffConfigMixin from "../ElectricityTariffConfigMixin.vue";

export default {
  name: "ElectricityTariffOctopusEnergy",
  mixins: [ElectricityTariffConfigMixin],
};
</script>
