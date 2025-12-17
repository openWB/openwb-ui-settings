<template>
  <div class="device-sigenergy-bat">
    <openwb-base-heading> Einstellungen für Sigenergy Batteriespeicher </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Der Sigenergy Speicher kann die Speicherentladung bei aktiver Speichersteuerung nur komplett sperren. Der
      teilweise Ausgleich durch Übergabe einer Entladeleistung an den Speicher ist nicht möglich. Die aktive Beladung
      des Speichers ist nicht möglich.
    </openwb-base-alert>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help> Die Standard-Modbus-ID von Sigenergy ist 247 </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSigenergyBat",
  mixins: [ComponentConfigMixin],
};
</script>
