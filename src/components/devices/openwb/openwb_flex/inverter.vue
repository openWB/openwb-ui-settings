<template>
  <div class="device-openwb-flex-inverter">
    <openwb-base-heading> Einstellungen für openWB-Flex Wechselrichter </openwb-base-heading>
    <openwb-base-select-input
      title="Zählermodell"
      not-selected="Bitte auswählen"
      :options="[
        { value: 0, text: 'MPM3PM' },
        { value: 1, text: 'Lovato' },
        { value: 2, text: 'SDM630/SDM72D-M' },
        { value: 3, text: 'SDM120' },
      ]"
      :model-value="component.configuration.version"
      required
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    />
    <openwb-base-number-input
      title="Modbus-ID"
      required
      :min="1"
      :max="255"
      :model-value="component.configuration.id"
      @update:model-value="updateConfiguration($event, 'configuration.id')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceOpenwbFlexInverter",
  mixins: [ComponentConfigMixin],
};
</script>
