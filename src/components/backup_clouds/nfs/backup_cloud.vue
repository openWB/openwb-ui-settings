<template>
  <div class="backup-cloud-nfs">
    <openwb-base-text-input
      title="Pfad zum NFS Share"
      pattern="^([^/: ]+):(\/[^/: ]+)+$"
      required
      :model-value="backupCloud.configuration.nfs_share"
      @update:model-value="updateConfiguration($event, 'configuration.nfs_share')"
    />
  </div>
</template>

<script>
import BackupCloudConfigMixin from "../BackupCloudConfigMixin.vue";

export default {
  name: "BackupCloudNfs",
  mixins: [BackupCloudConfigMixin],
};
</script>
