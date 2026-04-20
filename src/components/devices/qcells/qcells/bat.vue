<template>
  <div class="device-qcells-bat">
    <openwb-base-alert subtype="info">
      Die aktive Speichersteuerung erfolgt über das Solax Remote Control
      Modbus-Protokoll (Mode 1, Active Power Control).<br />
      Unterstützte Hardware: QCells Q.VOLT HYB-G3-3P (Solax Gen4).<br />
      openWB berechnet den Sollwert aus Hauslast und PV-Leistung.<br />
      Damit bei 0W Speicher-Sollwert die Batterie nicht entlädt, muss die
      Hausanschlussgrenze am EVU-Zähler (max_total_power) korrekt gesetzt
      sein.<br />
      Bitte die Felder "Maximale Ladeleistung" und "Maximale
      Entladeleistung" unter Ladeeinstellungen &gt; Speichersteuerung
      entsprechend der Leistungsfähigkeit des Wechselrichters und der
      angeschlossenen Batterie konfigurieren.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceQCellsBat",
  mixins: [ComponentConfigMixin],
};
</script>
