<template>
  <div class="device-solar-view">
    <openwb-base-heading> Einstellungen für SolarView </openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="device.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Timeout"
      required
      :model-value="device.configuration.timeout"
      @update:model-value="updateConfiguration($event, 'configuration.timeout')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceSolarView",
  mixins: [DeviceConfigMixin],
};
</script>
