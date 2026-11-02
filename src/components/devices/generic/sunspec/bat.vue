<template>
  <div class="device-generic-sunspec-bat">
    <openwb-base-heading> Einstellungen für SunSpec Speicher </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      :min="1"
      :max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help>
        Der Speicher gehört meist zum Wechselrichter und nutzt dieselbe Modbus-ID (in der Regel 1). Nur ändern, wenn der
        Speicher laut Dokumentation des Geräts eine eigene Modbus-ID hat.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceGenericSunspecBat",
  mixins: [ComponentConfigMixin],
};
</script>
