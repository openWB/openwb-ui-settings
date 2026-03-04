<template>
  <openwb-base-alert
    v-if="webTheme.official"
    subtype="success"
  >
    <font-awesome-icon :icon="['fas', 'certificate']" />
    Das ausgewählte Web Theme "{{ webTheme.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon :icon="['fas', 'people-group']" />
    Das ausgewählte Theme wird in unserer Community gepflegt. Rückfragen oder Probleme bitte im Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-alert :subtype="webTheme.userManagementSupported ? 'success' : 'warning'">
    <font-awesome-icon :icon="['fas', webTheme.userManagementSupported ? 'user-check' : 'user-slash']" />
    Das ausgewählte Web Theme "{{ webTheme.name }}" unterstützt die Benutzerverwaltung{{
      webTheme.userManagementSupported ? "" : " nicht"
    }}.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Web Theme "{{ webTheme.name }}" </openwb-base-heading>
  <component
    :is="getThemeComponent()"
    :web-theme="webTheme"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPeopleGroup as fasPeopleGroup,
  faCertificate as fasCertificate,
  faUserCheck as fasUserCheck,
  faUserSlash as fasUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate, fasUserCheck, fasUserSlash);

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
  methods: {
    getThemeComponent() {
      console.debug(`loading web theme: ${this.webTheme.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.webTheme.type}/webTheme.vue`),
        errorComponent: OpenwbWebThemeFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
