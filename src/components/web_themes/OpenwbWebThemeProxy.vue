<template>
  <openwb-base-alert
    v-if="webTheme.official"
    subtype="success"
  >
    <font-awesome-icon
      fixed-width
      :icon="['fas', 'certificate']"
    />
    Das ausgewählte Web Theme "{{ webTheme.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon
      fixed-width
      :icon="['fas', 'people-group']"
    />
    Das ausgewählte Theme wird in unserer Community gepflegt. Rückfragen oder Probleme bitte im Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Web Theme "{{ webTheme.name }}" </openwb-base-heading>
  <component
    :is="myComponent"
    :web-theme="webTheme"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPeopleGroup as fasPeopleGroup, faCertificate as fasCertificate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate);

import { defineAsyncComponent } from "vue";
import OpenwbWebThemeFallback from "./OpenwbWebThemeFallback.vue";

export default {
  name: "OpenwbWebThemeProxy",
  components: {
    FontAwesomeIcon,
  },
  props: {
    webTheme: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  computed: {
    myComponent() {
      console.debug(`loading web theme: ${this.webTheme.name}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.webTheme.type}/webTheme.vue`),
        errorComponent: OpenwbWebThemeFallback,
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
