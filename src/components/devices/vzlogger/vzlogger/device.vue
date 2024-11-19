<template>
  <div class="device-vzlogger">
    <openwb-base-heading> Einstellungen für VZLogger </openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    >
      <template #help> Bei Angabe des Ports muss auch das Schema mit angegeben werden: http://ip:port </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceVZLogger",
  mixins: [DeviceConfigMixin],
};
</script>
