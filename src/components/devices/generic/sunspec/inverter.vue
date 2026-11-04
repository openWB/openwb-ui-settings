<template>
  <div class="device-generic-sunspec-inverter">
    <openwb-base-heading> Einstellungen für SunSpec Wechselrichter </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      :min="1"
      :max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help>
        Beim Wechselrichter selbst ist das fast immer 1 (Werkseinstellung) und muss in der Regel nicht geändert werden.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceGenericSunspecInverter",
  mixins: [ComponentConfigMixin],
};
</script>
