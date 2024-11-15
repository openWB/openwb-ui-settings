<template>
  <div class="device-openwb-flex-consumption-counter">
    <openwb-base-heading> Einstellungen für openWB-Flex Verbrauchszähler </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Bei saldierenden Zählern (B23) werden die Zählerstände für Einspeisung und Bezug aus dem Zähler ausgelesen. Bei
      Zählern, die nicht saldierend arbeiten (SDM120, SDM630, SDM72D-M), wird der Zählerstand für den Bezug aus dem
      Zähler ausgelesen. Eine Messung der Einspeisung ist nicht möglich.
    </openwb-base-alert>
    <openwb-base-select-input
      title="Zählermodell"
      not-selected="Bitte auswählen"
      :options="[
        { value: 'sdm120', text: 'SDM120' },
        { value: 'sdm630', text: 'SDM630/SDM72D-M' },
        { value: 'b23', text: 'B23' },
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
  name: "DeviceOpenwbFlexConsumptionCounter",
  mixins: [ComponentConfigMixin],
};
</script>
