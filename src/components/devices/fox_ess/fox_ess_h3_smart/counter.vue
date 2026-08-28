<template>
  <div class="device-foxess-h3.smart-counter">
    <openwb-base-heading> Einstellungen für FoxEss H3 Smart Zähler </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help> Die Standard-Modbus-ID von FoxEss ist 247 </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceFoxEssH3SmartCounter",
  mixins: [ComponentConfigMixin],
};
</script>
