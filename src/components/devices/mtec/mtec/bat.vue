<template>
  <div class="device-mtec-bat">
    <openwb-base-heading> Einstellungen für M-Tec Batteriespeicher </openwb-base-heading>
    <openwb-base-select-input
      title="Generation"
      not-selected="Bitte auswählen"
      :options="[
        { value: 2, text: 'Gen 2' },
        { value: 3, text: 'Gen 3' },
      ]"
      :model-value="component.configuration.generation"
      required
      @update:model-value="updateConfiguration($event, 'configuration.generation')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help> Die Standard-Modbus-ID von M-Tec ist 247 </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceMTecBat",
  mixins: [ComponentConfigMixin],
};
</script>
