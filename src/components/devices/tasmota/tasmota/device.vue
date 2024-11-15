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
    <openwb-base-select-input
      title="Phase"
      not-selected="Bitte auswählen"
      :options="[
        { value: 1, text: '1' },
        { value: 2, text: '2' },
        { value: 3, text: '3' },
      ]"
      :model-value="device.configuration.phase"
      required
      @update:model-value="updateConfiguration($event, 'configuration.phase')"
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
