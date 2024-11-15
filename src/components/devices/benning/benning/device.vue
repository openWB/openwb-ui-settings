<template>
  <div class="device-benning">
    <openwb-base-heading>Einstellungen für Benning</openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceBenning",
  mixins: [DeviceConfigMixin],
};
</script>
