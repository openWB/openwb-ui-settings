<template>
  <div class="device-solar_world">
    <openwb-base-heading> Einstellungen für SolarWorld </openwb-base-heading>
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
  name: "DeviceSolarWorld",
  mixins: [DeviceConfigMixin],
};
</script>
