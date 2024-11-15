<template>
  <div class="vehicle-soc-psa">
    <openwb-base-alert subtype="danger">
      Diese Modul ist seit Änderungen der Schnittstellen durch PSA nicht mehr funktionsfähig und wird in einer
      zukünftigen Version entfernt. Bitte auf einen anderen Anbieter wechseln, z.B. Tronity.<br />
      Bei vorhandener PSA-Integration in Heimautomation kann der SoC ggf. auch per MQTT übergeben werden.
    </openwb-base-alert>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocPSA",
  mixins: [VehicleConfigMixin],
};
</script>
