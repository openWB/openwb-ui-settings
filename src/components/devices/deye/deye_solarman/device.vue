<template>
  <div class="device-deye-solarman">
    <openwb-base-heading>Einstellungen für Deye LSW Dongle</openwb-base-heading>
    <openwb-base-alert subtype="info">
      <span class="text-danger">
        Deye Wechselrichter verfügen über keine Modbus-TCP Schnittstelle. Dieses Modul ermöglicht die Anbindung über einen
        LSW-Dongle (WiFi Anbindung).
      </span>
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
      :model-value="device.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-number-input
      title="Seriennummer LSW-Dongle"
      required
      :min="1"
      :max="9999999999"
      :model-value="device.configuration.serial"
      @update:model-value="updateConfiguration($event, 'configuration.serial')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceDeyeSolarman",
  mixins: [DeviceConfigMixin],
};
</script>
