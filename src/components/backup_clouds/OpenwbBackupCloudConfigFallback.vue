<template>
  <div class="backup-cloud-fallback">
    <openwb-base-alert
      v-if="Object.keys(backupCloud.configuration).length == 0"
      subtype="info"
    >
      Die Backup-Cloud "{{ backupCloud.name }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für die Backup-Cloud "{{ backupCloud.name }}" gefunden. Die Einstellungen
        können als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="backupCloud.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfen Sie, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(backupCloud.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import BackupCloudConfigMixin from "./BackupCloudConfigMixin.vue";

export default {
  name: "BackupCloudConfigFallback",
  mixins: [BackupCloudConfigMixin],
};
</script>
