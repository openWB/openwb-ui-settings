<template>
  <div class="vehicle-soc-iobroker">
    <openwb-base-alert subtype="info">
      Für diese Anbindung wird der Adapter
      <a
        href="https://github.com/ioBroker/ioBroker.rest-api"
        target="_blank"
        rel="noopener"
        >ioBroker.rest-api</a
      >
      benötigt. Bitte in ioBroker installieren und starten, Standardport ist <strong>8093</strong>.
    </openwb-base-alert>
    <openwb-base-text-input
      title="ioBroker-URL"
      subtype="url"
      required
      :model-value="vehicle.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    >
      <template #help>
        Komplette URL mit Protokoll, IP/Hostname und Port des rest-api-Adapters.<br />
        Beispiel: http://192.168.1.20:8093
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Benutzer (optional)"
      subtype="text"
      :model-value="vehicle.configuration.user"
      @update:model-value="updateConfiguration($event, 'configuration.user')"
    >
      <template #help>Nur nötig, wenn im rest-api-Adapter die Authentifizierung aktiviert ist.</template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Passwort (optional)"
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help>Nur nötig, wenn im rest-api-Adapter die Authentifizierung aktiviert ist.</template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="State-ID SoC"
      subtype="text"
      required
      :model-value="vehicle.configuration.state_soc"
      @update:model-value="updateConfiguration($event, 'configuration.state_soc')"
    >
      <template #help>
        Vollständige State-ID aus ioBroker, z.B. der Objektbaum-Pfad eines Adapters.<br />
        Beispiel: <span class="text-info">renault.0.folder.soc</span><br />
        Zu finden im ioBroker Admin unter "Objekte", per Klick auf den State kopierbar.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="State-ID Reichweite"
      subtype="text"
      :model-value="vehicle.configuration.state_range"
      @update:model-value="updateConfiguration($event, 'configuration.state_range')"
    >
      <template #help>Optional. Leer lassen, wenn nicht verfügbar.</template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="State-ID Kilometerstand"
      subtype="text"
      :model-value="vehicle.configuration.state_odometer"
      @update:model-value="updateConfiguration($event, 'configuration.state_odometer')"
    >
      <template #help>Optional. Leer lassen, wenn nicht verfügbar.</template>
    </openwb-base-text-input>
    <openwb-base-button-group-input
      title="SoC während der Ladung berechnen"
      :buttons="[
        { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
        { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
      ]"
      :model-value="vehicle.configuration.calculate_soc"
      @update:model-value="updateConfiguration($event, 'configuration.calculate_soc')"
    >
      <template #help>
        Berechnet den Ladestand (SoC) während der Ladung, falls ioBroker den Wert nicht laufend aktualisiert.
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocIoBroker",
  mixins: [VehicleConfigMixin],
};
</script>
