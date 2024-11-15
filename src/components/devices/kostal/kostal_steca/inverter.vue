<template>
  <div class="device-kostal-steca-inverter">
    <openwb-base-heading>
      Einstellungen für Kostal Piko MP oder Steca Grid Coolcept Wechselrichter
    </openwb-base-heading>
    <openwb-base-button-group-input
      title="Variante"
      :buttons="[
        { buttonValue: false, text: 'Kostal Piko MP (non-plus)' },
        {
          buttonValue: true,
          text: 'Kostal Piko MP oder Steca Grid Coolcept',
        },
      ]"
      :model-value="component.configuration.variant_steca"
      @update:model-value="updateConfiguration($event, 'configuration.variant_steca')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceKostalStecaInverter",
  mixins: [ComponentConfigMixin],
};
</script>
