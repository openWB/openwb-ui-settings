<template>
  <openwb-base-heading> Einstellungen für Modul "{{ monitoring.name }}" </openwb-base-heading>
  <component
    :is="myComponent"
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
  computed: {
    myComponent() {
      console.debug(`loading monitoring: ${this.monitoring.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.monitoring.type}/monitoring.vue`),
        errorComponent: OpenwbMonitoringFallback,
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
