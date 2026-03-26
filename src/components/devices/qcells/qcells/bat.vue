<template>
  <div class="device-qcells-bat">
    <openwb-base-alert subtype="info">
      Die aktive Speichersteuerung erfolgt über das Solax Remote Control
      Modbus-Protokoll (Mode 8).<br />
      Unterstützte Hardware: QCells Q.VOLT HYB-G3-3P (Solax Gen4),
      Solax Gen4/Gen5/Gen6 Hybrid und AC Wechselrichter.<br />
      Gen2/Gen3 Wechselrichter werden nicht unterstützt, da diese kein
      Remote Control unterstützen.<br />
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
