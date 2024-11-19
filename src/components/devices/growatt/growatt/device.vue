<template>
  <div class="device-growatt">
    <openwb-base-heading>Einstellungen für Growatt</openwb-base-heading>
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
    <openwb-base-select-input
      title="Version"
      not-selected="Bitte auswählen"
      :options="[
        { value: 'MAX', text: 'MAX Series' },
        { value: 'TL-X', text: 'TL-X Inverter' },
      ]"
      :model-value="device.configuration.version"
      required
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    >
      <template #help>
        Die Wahl der API-Version beeinflusst die Auslesung der Speicherleistung und der Import/ Export Werte des
        Zählers.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceGrowatt",
  mixins: [DeviceConfigMixin],
};
</script>
