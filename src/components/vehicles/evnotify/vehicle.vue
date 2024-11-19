<template>
  <div class="vehicle-soc-evnotify">
    <openwb-base-number-input
      title="ID"
      required
      :min="0"
      :model-value="vehicle.configuration.id"
      @update:model-value="updateConfiguration($event, 'configuration.id')"
    />
    <openwb-base-text-input
      title="AKey"
      required
      :model-value="vehicle.configuration.akey"
      @update:model-value="updateConfiguration($event, 'configuration.akey')"
    />
    <openwb-base-text-input
      title="Token"
      required
      :model-value="vehicle.configuration.token"
      @update:model-value="updateConfiguration($event, 'configuration.token')"
    />
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocEvnotify",
  mixins: [VehicleConfigMixin],
};
</script>
