<template>
  <div class="flexible-tariff-fixed-price">
    <openwb-base-alert subtype="info">
      Ein fester Preis wird für die Berechnung der Ladekosten verwendet. Preisbasiertes Laden ist damit nicht möglich,
      dafür wird ein dynamischer Anbieter oder der zeitabhängige Tarif (HT/NT) benötigt.
    </openwb-base-alert>
    <openwb-base-number-input
      title="Preis"
      :step="0.001"
      :precision="3"
      required
      :min="0"
      unit="ct/kWh"
      :model-value="parseFloat((flexibleTariff.configuration.default_price * 100000).toFixed(4))"
      @update:model-value="updateConfiguration(parseFloat(($event / 100000).toFixed(7)), 'configuration.default_price')"
    />
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffFixedPrice",
  mixins: [FlexibleTariffConfigMixin],
};
</script>
