<template>
  <div class="device-solax-bat">
    <openwb-base-alert subtype="info">
      Die aktive Speichersteuerung wird nur für Solax "Gen 3 &amp; Gen 4 Hybrid"
      (z.B. X3-Hybrid-G4) unterstützt.<br />
      Die Steuerung erfolgt über das Solax Remote Control Modbus-Protokoll
      (Mode 4, Push Power-Positive/Negative).<br />
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
  name: "DeviceSolaxBat",
  mixins: [ComponentConfigMixin],
};
</script>
