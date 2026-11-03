<template>
  <div class="vehicle-soc-nissanconnect">
    <openwb-base-alert subtype="info">
      Experimentelles Modul für Nissan-Elektrofahrzeuge mit MyNISSAN in Europa. Die Anmeldung in der App muss möglich
      sein. Mit dem Leaf ZE1 getestet; andere Modelle sind noch nicht geprüft. NissanConnect EV wird nicht unterstützt.
      Das Modul nutzt eine inoffizielle API. Eine ausdrückliche Genehmigung durch Nissan ist nicht nachgewiesen; der
      Zugriff kann sich ändern.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Benutzername"
      aria-label="MyNISSAN-Benutzername"
      autocomplete="username"
      required
      subtype="user"
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
      <template #help> Die E-Mail-Adresse des MyNISSAN-Kontos. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Passwort"
      aria-label="MyNISSAN-Passwort"
      autocomplete="current-password"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help>
        Das Passwort des MyNISSAN-Kontos wird in den normalen openWB-Einstellungen gespeichert. Dieses Modul fügt keine
        zusätzliche Verschlüsselung hinzu. Einstellungen, Sicherungen und Detailprotokolle können sensible Kontodaten
        enthalten. Diese Daten vertraulich behandeln.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Fahrgestellnummer (VIN)"
      aria-label="Fahrgestellnummer (VIN)"
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help>
        Erforderlich, wenn im Konto mehrere Fahrzeuge hinterlegt sind. Bei nur einem Fahrzeug kann das Feld leer
        bleiben.
      </template>
    </openwb-base-text-input>
    <openwb-base-alert subtype="info">
      Ruft die bei Nissan gespeicherten Batteriedaten einschließlich ihres Messzeitpunkts ab. Das Fahrzeug wird dabei
      nicht aktiv aufgeweckt. Ältere Werte behalten ihren ursprünglichen Zeitstempel. Der gespeicherte Kilometerstand
      wird ebenfalls abgerufen, sofern verfügbar. Abfrageintervalle und Ladegrenzen werden in openWB eingestellt.
    </openwb-base-alert>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocNissanConnect",
  mixins: [VehicleConfigMixin],
};
</script>
