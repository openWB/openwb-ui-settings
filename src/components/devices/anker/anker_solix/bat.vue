<template>
  <div class="device-anker_solix-bat">
    <openwb-base-heading> Einstellungen für Anker Speicher </openwb-base-heading>
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
  name: "DeviceAnkerBat",
  mixins: [ComponentConfigMixin],
};
</script>
