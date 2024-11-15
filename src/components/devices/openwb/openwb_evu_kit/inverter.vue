<template>
  <div class="device-openwb-evukit-inverter">
    <openwb-base-heading> Einstellungen für openWB EVU-Kit Wechselrichter </openwb-base-heading>
    <openwb-base-select-input
      title="Zählermodell"
      not-selected="Bitte auswählen"
      :options="[
        { value: 0, text: 'MPM3PM' },
        { value: 1, text: 'Lovato' },
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
  name: "DeviceOpenwbEvukitInverter",
  mixins: [ComponentConfigMixin],
};
</script>
