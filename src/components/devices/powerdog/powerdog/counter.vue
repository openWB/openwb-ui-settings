<template>
  <div class="device-powerdog-counter">
    <openwb-base-heading> Einstellungen für Powerdog Zähler </openwb-base-heading>
    <openwb-base-button-group-input
      title="Einbau-Position"
      :buttons="[
        { buttonValue: false, text: 'Hausverbrauch' },
        { buttonValue: true, text: 'EVU-Punkt' },
      ]"
      :model-value="component.configuration.position_evu"
      @update:model-value="updateConfiguration($event, 'configuration.position_evu')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DevicePowerdogCounter",
  mixins: [ComponentConfigMixin],
};
</script>
