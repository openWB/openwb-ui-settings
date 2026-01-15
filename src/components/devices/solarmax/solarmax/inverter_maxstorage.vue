<template>
  <div class="device-solarmax-inverter-maxstorage">
    <openwb-base-heading>
      Einstellungen für Solarmax MAX.STORAGE / MAX.STORAGE Ultimate Wechselrichter
    </openwb-base-heading>
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
  name: "DeviceSolarmaxMsInverter",
  mixins: [ComponentConfigMixin],
};
</script>
