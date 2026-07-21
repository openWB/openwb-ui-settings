<template>
  <div class="vehicle-soc-vweuda">
    <openwb-base-alert subtype="info">
      Das VWEUDA-Modul kann Fahrzeugdaten für mehrere Marken des VW-Konzenrs abrufen.
      Das VWEUDA-Modul holt die Daten aus dem 
      <a
        href="https://eu-data-act.drivesomethinggreater.com/de/de"
        target="_blank"
        rel="noopener noreferrer"
        >VW-EU-DATA Portal</a
      > ab.<br/>
      Im Portal muss zuerst für jedes Fahrzeug ein "Benutzerdefinierter bzw. kontinuierlicher Datenabruf" eingerichtet werden mit folgenden Parametern:<br/>
      - Data Clusters:All Data<br/>
      - Intervall: 15 min<br/>
      - kein Ende<br/>
      Nach Einrichtung des Abrufs werden vom Portal im Abstand von ca. 15 Minuten zip-Dateien bereitgestellt.<br/>
      Zu Beginn können die Dateien den Zusatz _no_content im Namen haben und sind weitgehend leer.<br/>
      Nach einigen Stunden kommen dann die Dateien mit Inhalt.
      Diese werden dann vom VWEUDA-Modul abgeholt.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Benutzername"
      required
      subtype="user"
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
      <template #help> Der Benutzername(Email-Adresse) für die Anmeldung im Account der VW-Marke. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Kennwort"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help> Das Passwort für die Anmeldung im Account. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="VIN"
      required
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help> Die Fahrgestellnummer des Fahrzeugs. </template>
    </openwb-base-text-input>
    <openwb-base-button-group-input
      title="SoC während der Ladung berechnen"
      :buttons="[
        {
          buttonValue: false,
          text: 'Nein',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'Ja',
          class: 'btn-outline-success',
        },
      ]"
      :model-value="vehicle.configuration.calculate_soc"
      @update:model-value="updateConfiguration($event, 'configuration.calculate_soc')"
    >
      <template #help>
        Berechnet den Ladestand (SoC) während der Ladung. <br />
        Die Berechnung erfolgt über die Ladeleistung und die Ladedauer.
        <br />
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocVweuda",
  mixins: [VehicleConfigMixin],
};
</script>
