<template>
  <div class="device-kaco-nh-counter">
    <openwb-base-heading> Einstellungen für Kaco NH SmartMeter </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Mit diesem Modul ist kein phasenbasiertes Lastmanagement möglich, da keine Ströme der einzelnen Phasen gemessen
      werden.
    </openwb-base-alert>
    <openwb-base-number-input
      title="ID"
      required
      min="0"
      max="65535"
      :model-value="component.configuration.id"
      @update:model-value="updateConfiguration($event, 'configuration.id')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceKacoNHCounter",
  mixins: [ComponentConfigMixin],
};
</script>
