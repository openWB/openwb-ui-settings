<template>
  <div class="device-solarmax-counter-maxstorage">
    <openwb-base-heading> Einstellungen für Solarmax MAX.STORAGE / MAX.STORAGE Ultimate Zähler </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Bei Solarmax MAX.STORAGE / MAX.STORAGE Ultimate Zählern lassen sich die Ströme einzelner Phasen nicht auslesen.
      Eine Regelung ist daher nur anhand der Gesamtleistung möglich.
    </openwb-base-alert>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolarmaxMsCounter",
  mixins: [ComponentConfigMixin],
};
</script>
