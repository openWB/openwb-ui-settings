<template>
  <div class="flexible-tariff-westfalen-wind">
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      required
      :model-value="flexibleTariff.configuration.username"
      @update:model-value="updateConfiguration($event, 'configuration.username')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="flexibleTariff.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
    <openwb-base-text-input
      title="Vertrags-Nummer (optional)"
      :model-value="flexibleTariff.configuration.contract_id"
      @update:model-value="updateConfiguration($event, 'configuration.contract_id')"
    >
      <template #help>
        Bei mehreren Verträgen kann zusätzlich die Vertrags-Nummer angegeben werden, um die Preise dieses Vertrags
        abzurufen.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffWestfalenWind",
  mixins: [FlexibleTariffConfigMixin],
};
</script>
