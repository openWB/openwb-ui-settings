<template>
  <div class="flexible-tariff-awattar">
    <openwb-base-select-input
      title="Land"
      not-selected="Bitte auswählen"
      :options="[
        { value: 'de', text: 'Deutschland' },
        { value: 'at', text: 'Österreich' },
      ]"
      :model-value="flexibleTariff.configuration.country"
      @update:model-value="updateConfiguration($event, 'configuration.country')"
    >
      <template #help>
        Es werden die abgefragten Börsenpreise verwendet, die aWATTar bereitstellt. aWATTar-Gebühren oder Steuern werden
        nicht berücksichtigt.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffAwattar",
  mixins: [FlexibleTariffConfigMixin],
};
</script>
