<template>
  <div class="device-deye-bat">
    <openwb-base-heading> Einstellungen für Deye Batteriespeicher </openwb-base-heading>
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
  name: "DeviceDeyeBat",
  mixins: [ComponentConfigMixin],
};
</script>
