<template>
  <div class="device-tasmota">
    <openwb-base-heading>Einstellungen für Tasmota</openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
  </div>
</template>

<script>
import deviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceTasmota",
  mixins: [deviceConfigMixin],
};
</script>
