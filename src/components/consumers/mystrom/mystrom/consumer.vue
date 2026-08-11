<template>
  <div class="device-mystrom">
    <openwb-base-heading>Einstellungen für MyStrom</openwb-base-heading>
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
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerMyStrom",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
