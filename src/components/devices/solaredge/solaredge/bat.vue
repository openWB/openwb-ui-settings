<template>
  <div class="device-solaredge-bat">
    <openwb-base-heading> Einstellungen für SolarEdge Batteriespeicher </openwb-base-heading>
    <openwb-base-number-input
      title="SolarEdge-Geräte-ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-number-input
      title="SolarEdge-Batterie-Index"
      :model-value="component.configuration.battery_index"
      min="1"
      max="2"
      @update:model-value="updateConfiguration($event, 'configuration.battery_index')"
    >
      <template #help>
        Wenn eine zweite Batterie am Wechselrichter angeschlossen ist, hier den Index 2 eintagen. Im Normalfall immer 1 eintragen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolaredgeBat",
  mixins: [ComponentConfigMixin],
};
</script>
