<template>
  <div class="flexible-tariff-groupe-e">
    <openwb-base-alert subtype="info">
      Tarif Vario der Groupe E (Westschweiz) - www.groupe-e.ch/de/strom/vario
      <br />
      Der Tarif passt sich alle 15 Minuten an, abhängig von der aktuellen Netzauslastung und dem Marktpreis.
    </openwb-base-alert>
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffGroupeE",
  mixins: [FlexibleTariffConfigMixin],
};
</script>
