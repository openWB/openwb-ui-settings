<template>
  <div class="device-sunnyboy-bat">
    <openwb-base-heading> Einstellungen für SMA Sunny Boy / Tripower / Tesvolt Batteriespeicher </openwb-base-heading>
    <openwb-base-select-input
      title="Version"
      not-selected="Bitte auswählen"
      :options="[
        { value: 0, text: 'Hybrid Wechselrichter' },
        { value: 1, text: 'Sunny Boy Storage' },
        { value: 2, text: 'Tesvolt' },
      ]"
      :model-value="component.configuration.version"
      required
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    />
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
  name: "DeviceSunnyBoyBat",
  mixins: [ComponentConfigMixin],
};
</script>
