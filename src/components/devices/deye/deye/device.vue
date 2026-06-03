<template>
  <div class="device-deye">
    <openwb-base-heading>Einstellungen für Deye</openwb-base-heading>
    <openwb-base-alert subtype="info">
      <span class="text-danger">
        Deye Wechselrichter verfügen über keine Modbus-TCP Schnittstelle. Dieses Modul ermöglicht die Kommunikation über den
        LSE Dongle (LAN-Anbindung) oder einen RS485/LAN-Adapter.
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
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceDeye",
  mixins: [DeviceConfigMixin],
};
</script>
