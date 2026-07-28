<template>
  <div class="device-generic-modbus">
    <openwb-base-heading> Einstellungen für Universell Modbus</openwb-base-heading>
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
    <openwb-base-select-input
      title="Byteorder"
      not-selected="Bitte auswählen"
      :options="endianOptions"
      :model-value="device.configuration.byteorder"
      @update:model-value="updateConfiguration($event, 'configuration.byteorder')"
    />
    <openwb-base-select-input
      title="Wordorder"
      not-selected="Bitte auswählen"
      :options="endianOptions"
      :model-value="device.configuration.wordorder"
      @update:model-value="updateConfiguration($event, 'configuration.wordorder')"
    /> 
  </div>
</template>

<script>

const ENDIAN_OPTIONS = [
  { text: "Big endian", value: ">" },
  { text: "Little endian", value: "<" },
  { text: "Auto", value: "@" },
];

import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceGenericModbus",
  mixins: [DeviceConfigMixin],
  data() {
    return {
      endianOptions: ENDIAN_OPTIONS,
    };
  },
};
</script>


