<template>
  <div class="device-enecess-ecomain-counter">
    <openwb-base-heading> Einstellungen für EcoMain EVU-Zähler </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Die Phasenwerte und Gesamtwerte werden vom Hauptanschluss des EcoMain übernommen. Eine Frequenz wird vom EcoMain
      nicht bereitgestellt.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceEneCessEcoMainCounter",
  mixins: [ComponentConfigMixin],
};
</script>
