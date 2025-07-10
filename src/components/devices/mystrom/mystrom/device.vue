<template>
  <div class="device-mystrom">
    <openwb-base-heading>Einstellungen für mystrom</openwb-base-heading>
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
  name: "DeviceMystrom",
  mixins: [DeviceConfigMixin],
};
</script>
