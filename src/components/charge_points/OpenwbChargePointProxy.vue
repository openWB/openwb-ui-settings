<template>
  <openwb-base-heading>
    Einstellungen für Ladepunkt Typ "{{ chargePoint.type }}"
  </openwb-base-heading>
  <component
    :is="myChargePointSettingsComponent"
    :charge-point="chargePoint"
    @update:configuration="updateConfiguration($event)"
  />
  <hr>
  <openwb-base-heading>
    Befehle für Ladepunkt Typ "{{ chargePoint.type }}"
  </openwb-base-heading>
  <component
    :is="myChargePointCommandsComponent"
    :charge-point="chargePoint"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import ChargePointConfigMixin from "./ChargePointConfigMixin.vue";
import OpenwbChargePointConfigFallback from "./OpenwbChargePointConfigFallback.vue";
import OpenwbChargePointCommandsFallback from "./OpenwbChargePointCommandsFallback.vue";

export default {
  name: "OpenwbChargePointProxy",
  mixins: [ChargePointConfigMixin],
  computed: {
    myChargePointSettingsComponent() {
      console.debug(
        `loading charge point settings: ${this.chargePoint.type}`,
      );
      return defineAsyncComponent({
        loader: () =>
          import(`./${this.chargePoint.type}/chargePoint.vue`),
        errorComponent: OpenwbChargePointConfigFallback,
      });
    },
    myChargePointCommandsComponent() {
      console.debug(
        `loading charge point commands: ${this.chargePoint.type}`,
      );
      return defineAsyncComponent({
        loader: () => import(`./${this.chargePoint.type}/commands.vue`),
        errorComponent: OpenwbChargePointCommandsFallback,
      });
    },
  },
};
</script>
