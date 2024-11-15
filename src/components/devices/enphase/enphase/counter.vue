<template>
  <div class="device-enphase-counter">
    <openwb-base-heading> Einstellungen für Enphase Envoy / IQ Gateway Zähler </openwb-base-heading>
    <openwb-base-number-input
      title="EID"
      required
      :model-value="component.configuration.eid"
      @update:model-value="updateConfiguration($event, 'configuration.eid')"
    >
      <template #help> EID für "net-consumption" </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceEnphaseCounter",
  mixins: [ComponentConfigMixin],
};
</script>
