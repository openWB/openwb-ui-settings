<template>
  <div class="device-e3dc-bat">
    <openwb-base-heading> Aktive Speichersteuerung (optional) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Nur erforderlich, wenn der Speicher aktiv gesteuert werden soll (siehe Einstellungen -> Speicher). Ohne
      Zugangsdaten wird der Speicher weiterhin per Modbus ausgelesen, kann aber nicht gesteuert werden.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Portal-Benutzername"
      :model-value="component.configuration.portal_username"
      @update:model-value="updateConfiguration($event, 'configuration.portal_username')"
    >
      <template #help>
        Zugangsdaten des E3DC-Portal-Accounts, werden auch für die lokale RSCP-Verbindung zur Authentifizierung
        benötigt.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Portal-Passwort"
      subtype="password"
      :model-value="component.configuration.portal_password"
      @update:model-value="updateConfiguration($event, 'configuration.portal_password')"
    />
    <openwb-base-text-input
      title="RSCP-Passwort"
      subtype="password"
      :model-value="component.configuration.rscp_key"
      @update:model-value="updateConfiguration($event, 'configuration.rscp_key')"
    >
      <template #help>
        Lokaler Verschlüsselungscode, in den E3DC-Einstellungen unter "Hauptgerät -> Personalisieren -> RSCP-Passwort"
        vergeben.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceE3dcBat",
  mixins: [ComponentConfigMixin],
};
</script>
