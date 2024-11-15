<template>
  <openwb-base-alert
    v-if="displayTheme.official"
    subtype="success"
  >
    <font-awesome-icon
      fixed-width
      :icon="['fas', 'certificate']"
    />
    Das ausgewählte Display Theme "{{ displayTheme.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon
      fixed-width
      :icon="['fas', 'people-group']"
    />
    Das ausgewählte Display Theme "{{ displayTheme.name }}" wird in unserer Community gepflegt. Rückfragen oder Probleme
    bitte im Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Display Theme "{{ displayTheme.name }}" </openwb-base-heading>
  <component
    :is="myComponent"
    :display-theme="displayTheme"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPeopleGroup as fasPeopleGroup, faCertificate as fasCertificate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate);

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
  computed: {
    myComponent() {
      console.debug(`loading display theme: ${this.displayTheme.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.displayTheme.type}/displayTheme.vue`),
        errorComponent: OpenwbDisplayThemeFallback,
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
