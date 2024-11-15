<template>
  <div class="device-openwb-flex-counter">
    <openwb-base-heading> Einstellungen für openWB-Flex Zähler </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Bei saldierenden Zählern (MPM3PM, B23) werden die Zählerstände für Einspeisung und Bezug aus dem Zähler
      ausgelesen. Bei Zählern, die nicht saldierend arbeiten (Lovato, SDM630, SDM72D-M), werden die Zählerstände von der
      openWB berechnet.
    </openwb-base-alert>
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
  name: "DeviceOpenwbFlexCounter",
  mixins: [ComponentConfigMixin],
};
</script>
