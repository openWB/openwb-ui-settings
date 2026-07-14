<template>
  <div class="device-openwb-flex-local-consumption-counter">
    <openwb-base-heading> Einstellungen für openWB-Flex Verbrauchszähler </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Bei Zählern, die nicht saldierend arbeiten (SDM630, SDM72D-M), wird der Zählerstand für den Bezug aus dem
      Zähler ausgelesen. Eine Messung der Einspeisung ist nicht möglich.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Zählermodell"
      model-value="SDM630/SDM72D-M"
      disabled
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
  name: "DeviceOpenwbFlexLocalConsumptionCounter",
  mixins: [ComponentConfigMixin],
};
</script>
