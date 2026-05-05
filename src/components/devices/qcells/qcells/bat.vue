<template>
  <div class="device-qcells-bat">
    <openwb-base-alert subtype="info">
      Die aktive Speichersteuerung erfolgt über das Solax Remote Control
      Modbus-Protokoll (Mode 4, Push Power-Positive/Negative).<br />
      Unterstützte Hardware: QCells Q.VOLT HYB-G3-3P (Solax Gen4).<br />
      openWB übergibt die Speicherleistung direkt als Push-Power an den
      Wechselrichter (0W = Entladesperre).<br />
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
