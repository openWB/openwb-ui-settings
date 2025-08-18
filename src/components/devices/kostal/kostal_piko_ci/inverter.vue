<template>
  <div class="device-kostal-piko-ci-inverter">
    <openwb-base-heading> Einstellungen für Kostal Piko CI Wechselrichter </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help> Die Standard-Modbus-ID von Kostal Piko CI ist 75 </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceKostalPikoCiInverter",
  mixins: [ComponentConfigMixin],
};
</script>
