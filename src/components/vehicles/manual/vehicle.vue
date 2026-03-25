<template>
  <div class="vehicle-soc-manual">
    <openwb-base-alert subtype="info">
      Beim Anstecken des Fahrzeugs muss der aktuelle SoC-Wert des Fahrzeugs über die Hauptseite oder (wenn verbaut) am
      Display der openWB angegeben werden. Anhand des geladenen Stroms wird der aktuelle SoC-Wert des Fahrzeugs während
      der Ladung berechnet. Ausschlaggebend für die Genauigkeit der Berechnung sind die beiden Einstellungen "Kapazität
      der Batterie" und "Wirkungsgrad der Ladeelektronik" im Fahrzeug-Profil. Weitere Infos dazu im
      <a
        :href="`https://wiki.openwb.de/doku.php?id=openwb:vc:${systemVersion}:software:fahrzeug-infos:manueller-soc`"
        target="_blank"
        rel="noopener noreferrer"
      >
        Wiki-Beitrag zum manuellen SoC </a
      >.<br />
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
