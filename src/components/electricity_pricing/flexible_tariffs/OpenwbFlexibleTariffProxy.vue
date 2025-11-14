<template>
  <openwb-base-alert
    v-if="flexibleTariff.official"
    subtype="success"
  >
    <font-awesome-icon :icon="['fas', 'certificate']" />
    Das ausgewählte Modul "{{ flexibleTariff.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon :icon="['fas', 'people-group']" />
    Das ausgewählte Modul "{{ flexibleTariff.name }}" wird in unserer Community gepflegt. Rückfragen oder Probleme bitte
    im Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Modul "{{ flexibleTariff.name }}" </openwb-base-heading>
  <component
    :is="getTariffComponent()"
    :flexible-tariff="flexibleTariff"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPeopleGroup as fasPeopleGroup, faCertificate as fasCertificate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate);

import { defineAsyncComponent } from "vue";
import OpenwbFlexibleTariffFallback from "./OpenwbFlexibleTariffConfigFallback.vue";

export default {
  name: "OpenwbFlexibleTariffProxy",
  components: {
    FontAwesomeIcon,
  },
  props: {
    flexibleTariff: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    getTariffComponent() {
      console.debug(`loading flexible tariff: ${this.flexibleTariff.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.flexibleTariff.type}/flexible_tariff.vue`),
        errorComponent: OpenwbFlexibleTariffFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
