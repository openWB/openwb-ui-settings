<template>
  <div class="device-solar_log">
    <openwb-base-heading> Einstellungen für Solar-Log </openwb-base-heading>
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
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceSolarLog",
  mixins: [DeviceConfigMixin],
};
</script>
