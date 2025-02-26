<template>
  <div class="device-solaredge-bat">
    <openwb-base-heading> Einstellungen für SolarEdge Batteriespeicher </openwb-base-heading>
    <openwb-base-number-input
      title="SolarEdge-Geräte-ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-alert subtype="info">
      Hierfür muss eine zweite Batterie an einem Wechselrichter angeschlossen sein. Im Normalfall immer 1 ansonsten 2 wenn es 
      sich um die zweite Batterie handelt.
    </openwb-base-alert>
    <openwb-base-number-input
      title="SolarEdge-Batterie-Index"
      :model-value="component.configuration.battery_index"
      min="1"
      max="2"
      @update:model-value="updateConfiguration($event, 'configuration.battery_index')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolaredgeBat",
  mixins: [ComponentConfigMixin],
};
</script>
