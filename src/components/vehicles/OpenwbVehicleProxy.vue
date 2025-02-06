<template>
  <openwb-base-heading> Einstellungen für SoC-Modul "{{ vehicle.name }}" </openwb-base-heading>
  <component
    :is="getVehicleComponent()"
    :vehicle-id="vehicleId"
    :vehicle="vehicle"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbVehicleFallback from "./OpenwbVehicleConfigFallback.vue";

export default {
  name: "OpenwbVehicleProxy",
  props: {
    vehicleId: { type: Number, required: true },
    vehicle: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    getVehicleComponent() {
      console.debug(`loading vehicle: ${this.vehicle.name} (${this.vehicle.type})`);
      return defineAsyncComponent({
        loader: () => import(`./${this.vehicle.type}/vehicle.vue`),
        errorComponent: OpenwbVehicleFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
