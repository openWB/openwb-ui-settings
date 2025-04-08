<template>
  <div class="io-device-dimm-kit">
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="ioDevice.configuration.host"
      @update:model-value="updateConfiguration($event, 'configuration.host')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :model-value="ioDevice.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus-ID"
      required
      :min="1"
      :max="255"
      :model-value="ioDevice.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import OpenwbIoDeviceConfigMixin from "../OpenwbIoDeviceConfigMixin.vue";

export default {
  name: "IoDeviceDimmKit",
  mixins: [OpenwbIoDeviceConfigMixin],
};
</script>
