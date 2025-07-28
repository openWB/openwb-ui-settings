<template>
  <openwb-base-alert
    v-if="backupCloud.official"
    subtype="success"
  >
    <font-awesome-icon :icon="['fas', 'certificate']" />
    Das ausgewählte Backup-Cloud Modul "{{ backupCloud.name }}" wird von openWB gepflegt.
  </openwb-base-alert>
  <openwb-base-alert
    v-else
    subtype="info"
  >
    <font-awesome-icon :icon="['fas', 'people-group']" />
    Das ausgewählte Backup-Cloud Modul "{{ backupCloud.name }}" wird in unserer Community gepflegt. Rückfragen oder
    Probleme bitte im Forum diskutieren.
  </openwb-base-alert>
  <openwb-base-heading> Einstellungen für Backup-Cloud Modul "{{ backupCloud.name }}" </openwb-base-heading>
  <component
    :is="getBackupCloudComponent()"
    :backup-cloud="backupCloud"
    @update:configuration="updateConfiguration($event)"
    @send-command="sendCommand($event)"
  />
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPeopleGroup as fasPeopleGroup, faCertificate as fasCertificate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate);

import { defineAsyncComponent } from "vue";
import OpenwbBackupCloudConfigFallback from "./OpenwbBackupCloudConfigFallback.vue";

export default {
  name: "OpenwbBackupCloudProxy",
  components: {
    FontAwesomeIcon,
  },
  props: {
    backupCloud: { type: Object, required: true },
  },
  emits: ["update:configuration", "sendCommand"],
  methods: {
    getBackupCloudComponent() {
      console.debug(`loading backup cloud: ${this.backupCloud.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.backupCloud.type}/backup_cloud.vue`),
        errorComponent: OpenwbBackupCloudConfigFallback,
      });
    },
    // event pass through
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
    // event pass through
    sendCommand(event) {
      this.$emit("sendCommand", event);
    },
  },
};
</script>
