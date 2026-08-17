<template>
  <div class="device-idm">
    <openwb-base-heading> Einstellungen für Askoheat</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Im Web-Frontend des Heizstabs muss unter Expertsetup / Setup 3 eine statische IP-Adresse und der Modbus TCP Port
      502 (nicht 520) erfasst werden.
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
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerAskoheat",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
