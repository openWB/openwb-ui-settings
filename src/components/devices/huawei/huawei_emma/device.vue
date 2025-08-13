<template>
  <div class="device-huawei-emma">
    <openwb-base-heading> Einstellungen für Huawei EMMA </openwb-base-heading>
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
      min="0"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help>
        Huawei Emma nutzt entgegen der Modbus-Spezifikation standardmäßig die Modbus ID 0.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceHuaweiEmma",
  mixins: [DeviceConfigMixin],
};
</script>
