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
    <openwb-base-button-group-input
      title="Batteriedaten beim Anstecken und während der Ladung aktiv aktualisieren"
      :buttons="[
        { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
        { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
      ]"
      :model-value="vehicle.configuration.refresh_while_charging === true"
      @update:model-value="updateConfiguration($event, 'configuration.refresh_while_charging')"
    >
      <template #help>
        Standardmäßig ausgeschaltet. Fordert bei jedem neu erkannten Anstecken aktuelle Batteriedaten vom Fahrzeug an,
        auch wenn der letzte Versuch weniger als eine Stunde zurückliegt. Dabei kann das Fahrzeug aufgeweckt werden.
        Während der Ladung erfolgen weitere Versuche frühestens nach einer Stunde. Auch fehlgeschlagene Versuche zählen
        für diesen Abstand; Ladepausen ohne Abstecken lösen keinen zusätzlichen Versuch aus. Nach Neustart des Dienstes
        oder Neuladen der Modulkonfiguration beginnt die Erkennung neu: Ein bereits angestecktes Fahrzeug zählt dann
        einmalig als neu angesteckt. Die Aktualisierung benötigt zusätzliche Anfragen und Wartezeit; neue Fahrzeugdaten
        sind nicht garantiert.
      </template>
    </openwb-base-button-group-input>
    <openwb-base-alert subtype="info">
      Ohne aktive Aktualisierung liest das Modul die bei Nissan gespeicherten Batteriedaten. Ältere Werte behalten ihren
      ursprünglichen Messzeitpunkt, auch nach einem erfolglosen Aktualisierungsversuch. Der gespeicherte Kilometerstand
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
