<template>
  <div class="device-solax-bat">
    <openwb-base-heading> Einstellungen für Solax Batteriespeicher </openwb-base-heading>
    <openwb-base-number-input
      title="Batterie-Index"
      :model-value="component.configuration.battery_index"
      min="1"
      max="2"
      @update:model-value="updateConfiguration($event, 'configuration.battery_index')"
    >
      <template #help>
        Nur bei Gen5-Wechselrichtern mit einem zweiten Batteriemodul relevant, hier dann Index 2 eintragen. Im
        Normalfall immer 1 eintragen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolaxBat",
  mixins: [ComponentConfigMixin],
};
</script>
