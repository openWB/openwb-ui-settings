<template>
  <div class="device-studer-inverter">
    <openwb-base-heading> Einstellungen für Studer Wechselrichter </openwb-base-heading>
    <openwb-base-button-group-input
      title="Typ der MPPT Solarladeregler"
      :buttons="[
        { buttonValue: 'VT', text: 'Variotrack (VT-40/VT-65/VT-80)' },
        { buttonValue: 'VS', text: 'VarioString (VS-70/VS-120)' },
      ]"
      :model-value="component.configuration.vc_type"
      required
      @update:model-value="updateConfiguration($event, 'configuration.vc_type')"
    />
    <openwb-base-number-input
      title="Anzahl MPPT Solarladeregler"
      required
      :min="1"
      :max="9"
      :model-value="component.configuration.vc_count"
      @update:model-value="updateConfiguration($event, 'configuration.vc_count')"
    >
      <template #help> Anzahl (1-9) der Studer MPPT Solarladeregler im System (VS/VT) </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceStuderInverter",
  mixins: [ComponentConfigMixin],
};
</script>
