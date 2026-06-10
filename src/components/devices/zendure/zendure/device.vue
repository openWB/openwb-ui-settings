<template>
  <div class="device-zendure">
    <openwb-base-heading>Einstellungen für Zendure</openwb-base-heading>
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
  name: "DeviceZendure",
  mixins: [DeviceConfigMixin],
};
</script>
