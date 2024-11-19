<template>
  <div class="device-smart-me-counter">
    <openwb-base-heading> Einstellungen für smart-me Zähler </openwb-base-heading>
    <openwb-base-text-input
      title="Geräte-ID"
      required
      :model-value="component.configuration.id"
      @update:model-value="updateConfiguration($event, 'configuration.id')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSmartMeCounter",
  mixins: [ComponentConfigMixin],
};
</script>
