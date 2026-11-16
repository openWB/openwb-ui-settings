<template>
  <div class="device-solax-bat">
    <openwb-base-heading> Einstellungen für Solax Batteriespeicher </openwb-base-heading>
    <openwb-base-select-input
      title="Batterie-Index"
      :options="[
        { value: 1, text: '1' },
        { value: 2, text: '2' },
      ]"
      :model-value="component.configuration.battery_index"
      required
      @update:model-value="updateConfiguration($event, 'configuration.battery_index')"
    >
      <template #help>
        Nur bei Gen5-Wechselrichtern mit einem zweiten Batteriemodul relevant, hier dann Index 2 wählen. Im Normalfall
        immer 1 lassen.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolaxBat",
  mixins: [ComponentConfigMixin],
};
</script>
