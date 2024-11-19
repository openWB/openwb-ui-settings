<template>
  <div class="device-sunnyboy-counter">
    <openwb-base-heading> Einstellungen für SMA Sunny Boy/Tripower Zähler </openwb-base-heading>
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
  name: "DeviceSunnyBoyCounter",
  mixins: [ComponentConfigMixin],
};
</script>
