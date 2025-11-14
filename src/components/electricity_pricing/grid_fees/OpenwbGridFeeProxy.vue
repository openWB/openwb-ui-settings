<template>
  <openwb-base-alert
    v-if="gridFee.official"
    subtype="success"
  >
    <font-awesome-icon :icon="['fas', 'certificate']" />
    Das ausgewählte Modul "{{ gridFee.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon :icon="['fas', 'people-group']" />
    Das ausgewählte Modul "{{ gridFee.name }}" wird in unserer Community gepflegt. Rückfragen oder Probleme bitte im
    Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Modul "{{ gridFee.name }}" </openwb-base-heading>
  <component
    :is="getTariffComponent()"
    :grid-fee="gridFee"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPeopleGroup as fasPeopleGroup, faCertificate as fasCertificate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate);

import { defineAsyncComponent } from "vue";
import OpenwbGridFeeFallback from "./OpenwbGridFeeConfigFallback.vue";

export default {
  name: "OpenwbGridFeeProxy",
  components: {
    FontAwesomeIcon,
  },
  props: {
    gridFee: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    getTariffComponent() {
      console.debug(`loading grid fee: ${this.gridFee.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.gridFee.type}/grid_fee.vue`),
        errorComponent: OpenwbGridFeeFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
