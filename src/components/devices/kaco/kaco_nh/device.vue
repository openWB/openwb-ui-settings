<template>
  <div class="device-kaco-nh">
    <openwb-base-heading> Einstellungen für Kaco NH </openwb-base-heading>
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
    <openwb-base-text-input
      title="Seriennummer"
      required
      :model-value="device.configuration.serial_number"
      @update:model-value="updateConfiguration($event, 'configuration.serial_number')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceKacoNH",
  mixins: [DeviceConfigMixin],
};
</script>
