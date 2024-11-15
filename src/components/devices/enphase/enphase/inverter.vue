<template>
  <div class="device-enphase-inverter">
    <openwb-base-heading> Einstellungen für Enphase Envoy / IQ Gateway Wechselrichter </openwb-base-heading>
    <openwb-base-number-input
      title="EID"
      required
      :model-value="component.configuration.eid"
      @update:model-value="updateConfiguration($event, 'configuration.eid')"
    >
      <template #help> EID für "production" </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceEnphaseInverter",
  mixins: [ComponentConfigMixin],
};
</script>
