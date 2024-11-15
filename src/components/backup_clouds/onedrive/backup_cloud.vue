<template>
  <div class="backup-cloud-one-drive">
    <openwb-base-alert subtype="info">
      Zum Abruf der Zugangsberechtigung bitte die Konfiguration speichern, dann die Schritte 1-4 durchführen und danach
      die Konfiguration erneut speichern. <br />
      Auth Code und URL werden nur einmal benötigt werden nach erfolgreicher Autorisierung wieder gelöscht.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Backupverzeichnis in OneDrive"
      subtype="text"
      required
      pattern="^/(.*/)*"
      :model-value="backupCloud.configuration.backuppath"
      @update:model-value="updateConfiguration($event, 'configuration.backuppath')"
    >
      <template #help>
        In diesem Verzeichnis werden die Backupdateien erstellt. Bitte den Pfad mit / beenden. <br />
        Beispiel: /openWB/Backup/
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Anmeldedaten auf openWB gespeichert"
      readonly
      :model-value="backupCloud.configuration.persistent_tokencache ? 'Ja' : 'Nein'"
    />
    <openwb-base-heading> Zugang zu OneDrive für diese openWB autorisieren </openwb-base-heading>
    <openwb-base-button-input
      title="1. Anmeldeanforderung erstellen"
      button-text="Autorisierungs-Code anfordern"
      subtype="success"
      @button-clicked="sendSystemCommand('requestMSALAuthCode', {})"
    >
      <template #help>
        Es werden Zugangstokens für OneDrive angefordert. Diese werden nur lokal auf dieser openWB gespeichert. Genutzt
        wird Device Flow mit public application.<br />
        Weitere Infos:<br />
        <a
          href="https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-device-code"
          target="_blank"
          rel="noopener noreferrer"
          >https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-device-code</a
        >
        <a
          href="https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-client-applications"
          target="_blank"
          rel="noopener noreferrer"
          >https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-client-applications</a
        >
      </template>
    </openwb-base-button-input>
    <openwb-base-text-input
      title="2. Diesen Code kopieren"
      subtype="text"
      readonly
      :model-value="backupCloud.configuration.authcode"
    />
    <openwb-base-text-input
      title="3. Anmelde-URL aufrufen"
      subtype="url"
      readonly
      :model-value="backupCloud.configuration.authurl"
    >
      <template #help>
        Diese URL im Browser öffnen und den Code eingeben. Dies erzeugt die notwendigen Zugangsberechtigung für diese
        openWB.
      </template>
    </openwb-base-text-input>
    <openwb-base-button-input
      title="4. Token abrufen und speichern"
      button-text="Autorisierungs-Token abrufen"
      subtype="success"
      @button-clicked="sendSystemCommand('retrieveMSALTokens', {})"
    >
      <template #help>
        Zugangstoken wird abgerufen und gespeichert, damit das Backup durchgeführt werden kann. Zugangstoken werden nur
        lokal auf dieser openWB gespeichert.
      </template>
    </openwb-base-button-input>
  </div>
</template>

<script>
import BackupCloudConfigMixin from "../BackupCloudConfigMixin.vue";

export default {
  name: "BackupCloudOneDrive",
  mixins: [BackupCloudConfigMixin],
};
</script>
