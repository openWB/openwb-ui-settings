<template>
  <div class="device-victron-bat">
    <openwb-base-heading> Einstellungen für Victron Batteriespeicher </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID Speicher"
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
  name: "DeviceVictronBat",
  mixins: [ComponentConfigMixin],
};
</script>
