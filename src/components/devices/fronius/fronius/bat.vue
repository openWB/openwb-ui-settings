<template>
  <div class="device-fronius-bat">
    <openwb-base-heading> Einstellungen für Fronius Batteriespeicher </openwb-base-heading>
    <openwb-base-number-input
      title="Meter ID"
      required
      min="0"
      max="65535"
      :model-value="component.configuration.meter_id"
      @update:model-value="updateConfiguration($event, 'configuration.meter_id')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceFroniusBat",
  mixins: [ComponentConfigMixin],
};
</script>
