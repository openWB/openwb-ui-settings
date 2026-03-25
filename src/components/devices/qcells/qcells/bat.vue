<template>
  <div class="device-qcells-bat">
    <openwb-base-alert subtype="info">
      Die aktive Speichersteuerung erfolgt über das Solax Remote Control Modbus-Protokoll (Mode 8).<br />
      Unterstützte Hardware: QCells Q.VOLT HYB-G3-3P (Solax Gen4), Solax Gen4/Gen5/Gen6 Hybrid und AC
      Wechselrichter.<br />
      Gen2/Gen3 Wechselrichter werden nicht unterstützt, da diese kein Remote Control unterstützen.
    </openwb-base-alert>
    <openwb-base-alert subtype="warning">
      Die maximale Lade-/Entladeleistung muss der tatsächlichen Leistungsfähigkeit des
      Wechselrichters und der angeschlossenen Batterie entsprechen. Nicht kompatible Werte
      können zu Schäden an der Batterie oder dem Wechselrichter führen.
    </openwb-base-alert>
    <openwb-base-number-input
      title="Maximale Lade-/Entladeleistung"
      required
      :min="0"
      :max="10000"
      :step="100"
      unit="W"
      :model-value="component.configuration.max_power"
      @update:model-value="updateConfiguration($event, 'configuration.max_power')"
    >
      <template #help>
        Maximale Lade- und Entladeleistung des Speichers in Watt. Der Wert sollte der maximalen
        Lade-/Entladeleistung des Wechselrichters entsprechend der angeschlossenen Batteriekapazität
        entsprechen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceQCellsBat",
  mixins: [ComponentConfigMixin],
};
</script>
