<template>
  <div class="device-algodue">
    <openwb-base-heading> Einstellungen für Algodue</openwb-base-heading>
    <openwb-base-alert subtype="info">
      ModbusTCP muss aktiviert sein. Der Zähler ist auf Modbus-ID 1 und Port 502 vorkonfiguriert.
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
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceAlgodue",
  mixins: [DeviceConfigMixin],
};
</script>
