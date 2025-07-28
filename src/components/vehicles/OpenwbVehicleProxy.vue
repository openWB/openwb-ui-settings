<template>
  <openwb-base-alert
    v-if="vehicle.official"
    subtype="info"
  >
    <font-awesome-icon :icon="['fas', 'certificate']" />
    Das ausgewählte Fahrzeug-Modul "{{ vehicle.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon :icon="['fas', 'people-group']" />
    Das ausgewählte Fahrzeug-Modul "{{ vehicle.name }}" wird in unserer Community gepflegt. Rückfragen oder Probleme
    bitte im Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für SoC-Modul "{{ vehicle.name }}" </openwb-base-heading>
  <component
    :is="getVehicleComponent()"
    :vehicle-id="vehicleId"
    :vehicle="vehicle"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPeopleGroup as fasPeopleGroup, faCertificate as fasCertificate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate);
import { defineAsyncComponent } from "vue";
import OpenwbVehicleFallback from "./OpenwbVehicleConfigFallback.vue";

export default {
  name: "OpenwbVehicleProxy",
  components: {
    FontAwesomeIcon,
  },
  props: {
    vehicleId: { type: Number, required: true },
    vehicle: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    getVehicleComponent() {
      console.debug(`loading vehicle: ${this.vehicle.type}`);
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
