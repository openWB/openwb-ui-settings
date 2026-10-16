<template>
  <openwb-base-alert
    v-if="forecast.official"
    subtype="success"
  >
    <font-awesome-icon :icon="['fas', 'certificate']" />
    Das ausgewählte Prognose-Modul "{{ forecast.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon :icon="['fas', 'people-group']" />
    Das ausgewählte Prognose-Modul "{{ forecast.name }}" wird in unserer Community gepflegt. Rückfragen oder Probleme
    bitte im Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Modul "{{ forecast.name }}" </openwb-base-heading>
  <component
    :is="forecastComponent"
    :forecast="forecast"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPeopleGroup as fasPeopleGroup, faCertificate as fasCertificate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate);

import { defineAsyncComponent } from "vue";
import OpenwbForecastConfigFallback from "./OpenwbForecastConfigFallback.vue";

export default {
  name: "OpenwbForecastProxy",
  components: {
    FontAwesomeIcon,
  },
  props: {
    forecast: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  computed: {
    forecastComponent() {
      console.debug(`loading forecast provider: ${this.forecast.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.forecast.type}/forecast.vue`),
        errorComponent: OpenwbForecastConfigFallback,
      });
    },
  },
  methods: {
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
