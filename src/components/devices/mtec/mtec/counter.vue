<template>
  <div class="device-mtec-counter">
    <openwb-base-heading> Einstellungen für M-Tec Zähler </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help> Die Standard-Modbus-ID von M-Tec ist 247 </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceMTecCounter",
  mixins: [ComponentConfigMixin],
};
</script>
