<template>
  <div class="backup-cloud-nfs">
    <openwb-base-text-input
      title="Pfad zum NFS Share"
      pattern="^([^/: ]+):(\/[^/: ]+)+$"
      required
      :model-value="backupCloud.configuration.nfs_share"
      @update:model-value="updateConfiguration($event, 'configuration.nfs_share')"
    >
      <template #help>
        1. IP basierter Pfad: 1.2.3.4:/pfad/zum/nfs-share<br />
        2. Host (FQDN) basierter Pfad: backupserver.domain.net:/pfad/zum/nfs-share<br />
        Bitte entgegen der Syntax das Protokoll nicht davor schreiben. Falsch wäre, “nfs://” davor zu setzen.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import BackupCloudConfigMixin from "../BackupCloudConfigMixin.vue";

export default {
  name: "BackupCloudNfs",
  mixins: [BackupCloudConfigMixin],
};
</script>
