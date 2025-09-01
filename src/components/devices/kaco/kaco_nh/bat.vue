<template>
  <div class="device-kaco-nh-bat">
    <openwb-base-heading> Einstellungen für Kaco NH Batteriespeicher </openwb-base-heading>
    <openwb-base-number-input
      title="ID"
      required
      min="0"
      max="65535"
      :model-value="component.configuration.id"
      @update:model-value="updateConfiguration($event, 'id')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceKacoNHBat",
  mixins: [ComponentConfigMixin],
};
</script>
