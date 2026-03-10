<template>
  <openwb-base-alert
    v-if="displayTheme.official"
    subtype="success"
  >
    <font-awesome-icon :icon="['fas', 'certificate']" />
    Das ausgewählte Display Theme "{{ displayTheme.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon :icon="['fas', 'people-group']" />
    Das ausgewählte Display Theme "{{ displayTheme.name }}" wird in unserer Community gepflegt. Rückfragen oder Probleme
    bitte im Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-alert :subtype="displayTheme.userManagementSupported ? 'success' : 'warning'">
    <font-awesome-icon :icon="['fas', displayTheme.userManagementSupported ? 'user-check' : 'user-slash']" />
    Das ausgewählte Display Theme "{{ displayTheme.name }}" unterstützt die Benutzerverwaltung{{
      displayTheme.userManagementSupported ? "" : " nicht"
    }}.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Display Theme "{{ displayTheme.name }}" </openwb-base-heading>
  <component
    :is="getDisplayThemeComponent()"
    :display-theme="displayTheme"
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
import OpenwbDisplayThemeFallback from "./OpenwbDisplayThemeFallback.vue";

export default {
  name: "OpenwbDisplayThemeProxy",
  components: {
    FontAwesomeIcon,
  },
  props: {
    displayTheme: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    getDisplayThemeComponent() {
      console.debug(`loading display theme: ${this.displayTheme.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.displayTheme.type}/displayTheme.vue`),
        errorComponent: OpenwbDisplayThemeFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
