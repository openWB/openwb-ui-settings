<template>
  <openwb-base-heading> Einstellungen für Backup-Cloud Modul "{{ backupCloud.name }}" </openwb-base-heading>
  <component
    :is="myComponent"
    :backup-cloud="backupCloud"
    @update:configuration="updateConfiguration($event)"
    @send-command="sendCommand($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbBackupCloudFallback from "./OpenwbBackupCloudConfigFallback.vue";

export default {
  name: "OpenwbBackupCloudProxy",
  props: {
    backupCloud: { type: Object, required: true },
  },
  emits: ["update:configuration", "sendCommand"],
  computed: {
    myComponent() {
      console.debug(`loading backup cloud: ${this.backupCloud.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.backupCloud.type}/backup_cloud.vue`),
        errorComponent: OpenwbBackupCloudFallback,
      });
    },
  },
  methods: {
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
