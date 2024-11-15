<template>
  <div class="vehicle-soc-tesla">
    <openwb-base-alert subtype="info">
      Beim Anstecken des Fahrzeugs muss der aktuelle SoC über die Hauptseite angegeben werden. Anhand des Zählers im
      Ladepunkt wird dann der aktuelle SoC errechnet. Ausschlaggebend für die Qualität dieses Moduls sind die beiden
      Einstellungen "Kapazität der Batterie" in dem Fahrzeug-Profil und "Wirkungsgrad der Ladeelektronik".
    </openwb-base-alert>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocManual",
  mixins: [VehicleConfigMixin],
};
</script>
