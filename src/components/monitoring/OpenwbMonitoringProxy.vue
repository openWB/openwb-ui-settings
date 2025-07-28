<template>
  <openwb-base-alert
    v-if="monitoring.official"
    subtype="success"
  >
    <font-awesome-icon :icon="['fas', 'certificate']" />
    Das ausgewählte Monitoring Modul "{{ monitoring.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon :icon="['fas', 'people-group']" />
    Das ausgewählte Monitoring Modul "{{ monitoring.name }}" wird in unserer Community gepflegt. Rückfragen oder
    Probleme bitte im Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Modul "{{ monitoring.name }}" </openwb-base-heading>
  <component
    :is="getMonitoringComponent()"
    :monitoring="monitoring"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPeopleGroup as fasPeopleGroup, faCertificate as fasCertificate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate);

import { defineAsyncComponent } from "vue";
import OpenwbMonitoringFallback from "./OpenwbMonitoringConfigFallback.vue";

export default {
  name: "OpenwbMonitoringProxy",
  components: {
    FontAwesomeIcon,
  },
  props: {
    monitoring: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    getMonitoringComponent() {
      console.debug(`loading monitoring: ${this.monitoring.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.monitoring.type}/monitoring.vue`),
        errorComponent: OpenwbMonitoringFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
