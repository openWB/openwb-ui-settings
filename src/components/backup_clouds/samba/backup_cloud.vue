<template>
  <div class="backup-cloud-samba">
    <openwb-base-text-input
      title="Server"
      subtype="host"
      required
      :model-value="backupCloud.configuration.smb_server"
      @update:model-value="updateConfiguration($event, 'configuration.smb_server')"
    />
    <openwb-base-text-input
      title="Freigabe"
      required
      :model-value="backupCloud.configuration.smb_share"
      @update:model-value="updateConfiguration($event, 'configuration.smb_share')"
    />
    <openwb-base-text-input
      title="Unterordner (optional)"
      :model-value="backupCloud.configuration.smb_path"
      pattern='(^\/$)|(^([^\\:"\|*?<>]+\/)+$)'
      required
      @update:model-value="updateConfiguration($event, 'configuration.smb_path')"
    >
      <template #help>
        Jeder Unterordner muss mit / enden.<br />
        Die Zeichen \:"|*?&lt;&gt; sind verboten!<br />
        Beispiel 1: openwb/ <br />
        Beispiel 2: openwb/lp2/
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Benutzer"
      subtype="user"
      :model-value="backupCloud.configuration.smb_user"
      @update:model-value="updateConfiguration($event, 'configuration.smb_user')"
    />
    <openwb-base-text-input
      title="Kennwort"
      subtype="password"
      :model-value="backupCloud.configuration.smb_password"
      @update:model-value="updateConfiguration($event, 'configuration.smb_password')"
    />
  </div>
</template>

<script>
import BackupCloudConfigMixin from "../BackupCloudConfigMixin.vue";

export default {
  name: "BackupCloudSamba",
  mixins: [BackupCloudConfigMixin],
};
</script>
