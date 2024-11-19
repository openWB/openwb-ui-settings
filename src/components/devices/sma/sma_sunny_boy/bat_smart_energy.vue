<template>
  <div class="device-sunnyboy-bat-smart-energy">
    <openwb-base-heading> Einstellungen für SMA Sunny Boy Smart Energy Batteriespeicher </openwb-base-heading>

    <openwb-base-number-input
      title="Modbus ID"
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
  name: "DeviceSunnyBoyBatSmartEnergy",
  mixins: [ComponentConfigMixin],
};
</script>
