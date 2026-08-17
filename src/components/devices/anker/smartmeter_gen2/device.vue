<template>
  <div class="device-smartmeter_gen2">
    <openwb-base-heading> Einstellungen für Anker SOLIX Smart Meter Gen 2</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Nicht alle Zähler von Anker unterstützen Modbus TCP, in den Einstellungen muss es aktiviert sein.
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
    <openwb-base-number-input
      title="Modbus ID"
      required
      :min="1"
      :max="255"
      :model-value="device.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceAnkerSmartmeterGen2",
  mixins: [DeviceConfigMixin],
};
</script>
