<template>
  <div class="device-sunnyboy">
    <openwb-base-heading> Einstellungen für SMA Sunny Boy/Tripower </openwb-base-heading>
    <openwb-base-alert subtype="info">
      ModbusTCP muss entweder direkt am Wechselrichter, per Sunny Portal oder über das Tool "Sunny Explorer" aktiviert
      werden. Dies ist standardmäßig deaktiviert.
    </openwb-base-alert>
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
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceSunnyBoy",
  mixins: [DeviceConfigMixin],
};
</script>
