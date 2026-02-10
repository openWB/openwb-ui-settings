<template>
  <div class="device-idm">
    <openwb-base-heading> Einstellungen für my-PV Acthor oder Elwa2 Heizstab</openwb-base-heading>
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
    <openwb-base-text-input
      title="Model"
      subtype="text"
      :model-value="device.configuration.model"
      @update:model-value="updateConfiguration($event, 'configuration.model')"
    />
    <openwb-base-number-input
      title="Max Leistung"
      required
      :model-value="device.configuration.max_power"
      min="1"
      @update:model-value="updateConfiguration($event, 'configuration.max_power')"
    />
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerMyPvActhor",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
