<template>
  <div class="device-openwb-flex-local-consumption-counter">
    <openwb-base-heading> Einstellungen für Verbrauchszähler mit lokaler Auslesung </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Der Verbrauchszähler mit lokaler Auslesung unterstützt ausschließlich den Zählertyp SDM630/SDM72D-M. 
      Der Zählerstand für den Bezug wird aus dem Zähler ausgelesen. Eine Messung der Einspeisung ist nicht möglich.
    </openwb-base-alert>
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
