<template>
  <div class="device-generic-sunspec">
    <openwb-base-heading> Einstellungen für SunSpec </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Modbus TCP muss am Gerät aktiviert sein. Funktioniert mit jedem SunSpec-kompatiblen Wechselrichter, unabhängig vom
      Hersteller.
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
  name: "DeviceGenericSunspec",
  mixins: [DeviceConfigMixin],
};
</script>
