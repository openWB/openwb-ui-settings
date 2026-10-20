<template>
  <div class="device-keba-e10">
    <openwb-base-heading> Einstellungen für KEBA KeContact E10 </openwb-base-heading>

    <openwb-base-text-input
      title="IP-Adresse oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    >
      <template #help> IP-Adresse oder Hostname des KEBA E10 im lokalen Netzwerk. </template>
    </openwb-base-text-input>

    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="device.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    >
      <template #help> Modbus-TCP-Port des KEBA E10. Standard: 502. </template>
    </openwb-base-number-input>

    <openwb-base-number-input
      title="Modbus-ID"
      required
      :min="1"
      :max="247"
      :model-value="device.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help> Modbus Unit-ID des KEBA E10. Standard: 1. </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceKebaE10",
  mixins: [DeviceConfigMixin],
};
</script>
