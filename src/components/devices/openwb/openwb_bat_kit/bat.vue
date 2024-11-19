<template>
  <div class="device-openwb-batkit-bat">
    <openwb-base-heading> Einstellungen für openWB EVU-Kit Batteriespeicher </openwb-base-heading>
    <openwb-base-select-input
      title="Zählermodell"
      not-selected="Bitte auswählen"
      :options="[
        { value: 0, text: 'MPM3PM' },
        { value: 1, text: 'SDM120' },
        { value: 2, text: 'SDM630/SDM72D-M' },
      ]"
      :model-value="component.configuration.version"
      required
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceOpenwbBatkitBat",
  mixins: [ComponentConfigMixin],
};
</script>
