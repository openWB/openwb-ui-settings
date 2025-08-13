<template>
  <openwb-base-alert
    v-if="electricityTariff.official"
    subtype="success"
  >
    <font-awesome-icon :icon="['fas', 'certificate']" />
    Das ausgewählte Modul "{{ electricityTariff.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon :icon="['fas', 'people-group']" />
    Das ausgewählte Modul "{{ electricityTariff.name }}" wird in unserer Community gepflegt. Rückfragen oder Probleme
    bitte im Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Modul "{{ electricityTariff.name }}" </openwb-base-heading>
  <component
    :is="getTariffComponent()"
    :electricity-tariff="electricityTariff"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPeopleGroup as fasPeopleGroup, faCertificate as fasCertificate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate);

import { defineAsyncComponent } from "vue";
import OpenwbElectricityTariffFallback from "./OpenwbElectricityTariffConfigFallback.vue";

export default {
  name: "OpenwbElectricityTariffProxy",
  components: {
    FontAwesomeIcon,
  },
  props: {
    electricityTariff: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    getTariffComponent() {
      console.debug(`loading electricity tariff: ${this.electricityTariff.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.electricityTariff.type}/electricity_tariff.vue`),
        errorComponent: OpenwbElectricityTariffFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
