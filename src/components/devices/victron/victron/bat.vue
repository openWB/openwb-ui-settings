<template>
  <div class="device-victron-bat">
    <openwb-base-heading> Einstellungen für Victron Batteriespeicher </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID Speicher"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-number-input
      title="Modbus ID VE.Bus"
      required
      :model-value="component.configuration.vebus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.vebus_id')"
    >
      <template #help>
        Die Modbus ID des VE.Bus kann je nach Victron Version abweichen. Übliche IDs sind 227, 228, 242 und 246.<br />
        Die ID kann unter "Settings > Services > Modbus/TCP > Available services" eingesehen werden.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceVictronBat",
  mixins: [ComponentConfigMixin],
};
</script>
