<template>
  <div class="device-openwb-evukit-counter">
    <openwb-base-heading> Einstellungen für openWB EVU-Kit Zähler </openwb-base-heading>
    <openwb-base-select-input
      title="Zählermodell"
      not-selected="Bitte auswählen"
      :options="[
        { value: 3, text: 'B23' },
        { value: 1, text: 'Lovato' },
        { value: 0, text: 'MPM3PM' },
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
  name: "DeviceOpenwbEvukitCounter",
  mixins: [ComponentConfigMixin],
};
</script>
