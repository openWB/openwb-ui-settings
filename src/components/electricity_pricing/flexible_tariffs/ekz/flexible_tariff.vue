<template>
  <div class="flexible-tariff-ekz">
    <openwb-base-alert subtype="info">
      Dynamischer Tarif der Elektrizitätswerke des Kantons Zürich (EKZ) -
      www.ekz.ch/de/privatkunden/strom/tarife/dynamischer-wahltarif.html
      <br />
      Der Tarif passt sich alle 15 Minuten an, abhängig von der aktuellen Netzauslastung und dem Marktpreis.
      <br />
      Die Preise für den nächsten Tag werden jeweils am Vortag um 18 Uhr publiziert.
      <br />
    </openwb-base-alert>
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffEkz",
  mixins: [FlexibleTariffConfigMixin],
};
</script>
