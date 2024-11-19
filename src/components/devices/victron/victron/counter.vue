<template>
  <div class="device-victron-counter">
    <openwb-base-heading> Einstellungen für Victron Zähler </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-button-group-input
      title="Messgerät"
      :buttons="[
        { buttonValue: false, text: 'AC-In Victron GX' },
        { buttonValue: true, text: 'Energy Meter' },
      ]"
      :model-value="component.configuration.energy_meter"
      @update:model-value="updateConfiguration($event, 'configuration.energy_meter')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceVictronCounter",
  mixins: [ComponentConfigMixin],
};
</script>
