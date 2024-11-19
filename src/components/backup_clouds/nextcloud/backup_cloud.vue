<template>
  <div class="backup-cloud-next-cloud">
    <openwb-base-text-input
      title="Cloud-URL"
      subtype="host"
      required
      :model-value="backupCloud.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    >
      <template #help>
        Die Cloud-URL wird in der Form 'https://nextcloud-url' und Benutzername im Eingabefeld oder mit Zugangstoken
        erwartet. Die URL kann je nach NextCloud Installation so 'https://nextcloud-url/s/user_token' oder so
        'https://nextcloud-url/index.php/s/user_token' aussehen.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      :model-value="backupCloud.configuration.user"
      @update:model-value="updateConfiguration($event, 'configuration.user')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      :model-value="backupCloud.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
  </div>
</template>

<script>
import BackupCloudConfigMixin from "../BackupCloudConfigMixin.vue";

export default {
  name: "BackupCloudNextCloud",
  mixins: [BackupCloudConfigMixin],
};
</script>
