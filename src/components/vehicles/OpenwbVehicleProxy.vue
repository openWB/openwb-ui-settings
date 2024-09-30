<template>
  <openwb-base-heading>
    Einstellungen für SoC-Modul "{{ vehicle.name }}"
  </openwb-base-heading>
  <component
    :is="myComponent"
    :vehicle-id="vehicleId"
    :vehicle="vehicle"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import VehicleConfigMixin from "./VehicleConfigMixin.vue";
import OpenwbVehicleFallback from "./OpenwbVehicleConfigFallback.vue";

export default {
  name: "OpenwbVehicleProxy",
  mixins: [VehicleConfigMixin],
  computed: {
    myComponent() {
      console.debug(`loading vehicle: ${this.vehicle.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.vehicle.type}/vehicle.vue`),
        errorComponent: OpenwbVehicleFallback,
      });
    },
  },
};
</script>
