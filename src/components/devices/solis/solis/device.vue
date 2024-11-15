<template>
  <div class="device-solis">
    <openwb-base-heading>Einstellungen für Solis</openwb-base-heading>
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
      title="Version"
      not-selected="Bitte auswählen"
      :options="[
        {
          value: 'inverter',
          text: 'Wechselrichter ohne Speicheranbindung',
        },
        { value: 'hybrid', text: 'Hybridwechselrichter RHI/S Serie' },
      ]"
      :model-value="device.configuration.version"
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceSolis",
  mixins: [DeviceConfigMixin],
};
</script>
