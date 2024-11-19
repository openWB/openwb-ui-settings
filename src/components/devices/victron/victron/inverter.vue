<template>
  <div class="device-victron-inverter">
    <openwb-base-heading> Einstellungen für Victron Wechselrichter </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-button-group-input
      title="MPPT"
      :buttons="[
        { buttonValue: false, text: 'Nein' },
        { buttonValue: true, text: 'Ja' },
      ]"
      :model-value="component.configuration.mppt"
      @update:model-value="updateConfiguration($event, 'configuration.mppt')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceVictronInverter",
  mixins: [ComponentConfigMixin],
};
</script>
