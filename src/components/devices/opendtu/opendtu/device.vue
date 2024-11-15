<template>
  <div class="device-opendtu">
    <openwb-base-heading>Einstellungen für OpenDTU</openwb-base-heading>
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
  name: "DeviceOpenDTU",
  mixins: [DeviceConfigMixin],
};
</script>
