<template>
  <openwb-base-heading> Einstellungen für Ladepunkt Typ "{{ chargePoint.type }}" </openwb-base-heading>
  <component
    :is="getChargePointSettingsComponent()"
    :charge-point="chargePoint"
    @update:configuration="updateConfiguration($event)"
  />
  <hr />
  <openwb-base-heading> Befehle für Ladepunkt Typ "{{ chargePoint.type }}" </openwb-base-heading>
  <component
    :is="getChargePointCommandsComponent()"
    :charge-point="chargePoint"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbChargePointConfigFallback from "./OpenwbChargePointConfigFallback.vue";
import OpenwbChargePointCommandsFallback from "./OpenwbChargePointCommandsFallback.vue";

export default {
  name: "OpenwbChargePointProxy",
  props: {
    chargePoint: { required: true, type: Object },
  },
  emits: ["update:configuration"],
  methods: {
    getChargePointSettingsComponent() {
      console.debug(`loading charge point settings: ${this.chargePoint.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.chargePoint.type}/chargePoint.vue`),
        errorComponent: OpenwbChargePointConfigFallback,
      });
    },
    getChargePointCommandsComponent() {
      console.debug(`loading charge point commands: ${this.chargePoint.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.chargePoint.type}/commands.vue`),
        errorComponent: OpenwbChargePointCommandsFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
