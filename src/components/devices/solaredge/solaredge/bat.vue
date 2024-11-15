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
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolaredgeBat",
  mixins: [ComponentConfigMixin],
};
</script>
