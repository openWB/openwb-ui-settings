<template>
  <div class="device-solaredge-inverter">
    <openwb-base-heading> Einstellungen für SolarEdge Wechselrichter </openwb-base-heading>
    <openwb-base-number-input
      title="SolarEdge-Geräte-ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolaredgeInverter",
  mixins: [ComponentConfigMixin],
};
</script>
