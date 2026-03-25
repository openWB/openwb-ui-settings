<template>
  <div class="vehicle-soc-manual">
    <openwb-base-alert subtype="info">
      Beim Anstecken des Fahrzeugs muss der aktuelle SoC über die Hauptseite angegeben werden. Anhand des Zählers im
      Ladepunkt wird dann der aktuelle SoC errechnet. Ausschlaggebend für die Qualität dieses Moduls sind die beiden
      Einstellungen "Kapazität der Batterie" und "Wirkungsgrad der Ladeelektronik" in dem Fahrzeug-Profil.
    </openwb-base-alert>
    <openwb-base-button-group-input
      title="SoC ohne manuelle Eingabe"
      :buttons="[
        {
          buttonValue: false,
          text: 'letzten SoC beibehalten',
        },
        {
          buttonValue: true,
          text: 'nach dem Abstecken auf 0% zurücksetzen',
        },
      ]"
      :model-value="vehicle.configuration.reset_after_unplug"
      @update:model-value="updateConfiguration($event, 'configuration.reset_after_unplug')"
    >
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocManual",
  mixins: [VehicleConfigMixin],
};
</script>
