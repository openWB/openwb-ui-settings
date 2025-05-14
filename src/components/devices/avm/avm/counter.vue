<template>
  <div class="device-avm-counter">
    <openwb-base-heading> Einstellungen für AVM Fritz!Box Zähler </openwb-base-heading>
    <openwb-base-text-input
      title="Gerätename in der Fritz!Box"
      required
      :model-value="component.configuration.name"
      @update:model-value="updateConfiguration($event, 'configuration.name')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceAvmCounter",
  mixins: [ComponentConfigMixin],
};
</script>
