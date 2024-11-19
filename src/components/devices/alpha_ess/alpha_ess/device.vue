<template>
  <div class="device-alphaess">
    <openwb-base-heading> Einstellungen für Alpha ESS </openwb-base-heading>
    <openwb-base-select-input
      title="Ausleseart"
      not-selected="Bitte auswählen"
      required
      :options="[
        { value: 0, text: 'Alpha ESS-Kit' },
        { value: 1, text: 'Hi 5/10' },
      ]"
      :model-value="device.configuration.source"
      @update:model-value="updateConfiguration($event, 'configuration.source')"
    />
    <openwb-base-text-input
      v-if="device.configuration.source == 1"
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      v-if="device.configuration.source == 1"
      title="Port"
      subtype="host"
      required
      :min="1"
      :max="65535"
      :model-value="device.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      v-if="device.configuration.source == 1"
      title="Modbus ID"
      required
      :model-value="device.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-select-input
      title="Firmware Version"
      not-selected="Bitte auswählen"
      required
      :options="[
        { value: 0, text: 'EMS älter als 1.23V' },
        { value: 1, text: 'EMS 1.23V oder neuer' },
      ]"
      :model-value="device.configuration.version"
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceAlphaess",
  mixins: [DeviceConfigMixin],
};
</script>
