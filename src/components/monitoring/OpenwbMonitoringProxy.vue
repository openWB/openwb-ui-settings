<template>
  <openwb-base-heading> Einstellungen für Modul "{{ monitoring.name }}" </openwb-base-heading>
  <component
    :is="getMonitoringComponent()"
    :monitoring="monitoring"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbMonitoringFallback from "./OpenwbMonitoringConfigFallback.vue";

export default {
  name: "OpenwbMonitoringProxy",
  props: {
    monitoring: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    getMonitoringComponent() {
      console.debug(`loading monitoring: ${this.monitoring.name} (${this.monitoring.type})`);
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
