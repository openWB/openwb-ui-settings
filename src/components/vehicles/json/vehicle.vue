<template>
  <div class="vehicle-soc-json">
    <openwb-base-text-input
      title="URL"
      subtype="url"
      required
      :model-value="vehicle.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    >
      <template #help>
        Es wird eine komplette URL erwartet mit Angaben zum Protokoll, IP oder Hostnamen, optional einem Port und einem
        Pfad. Die Antwort muss ein json-Objekt sein. Beispiel: http://192.168.1.1:8080/json?data=1
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Abfrage für SoC"
      subtype="text"
      required
      :model-value="vehicle.configuration.soc_pattern"
      @update:model-value="updateConfiguration($event, 'configuration.soc_pattern')"
    >
      <template #help>
        Zur Analyse der Werte aus dem json-Objekt wird jq benutzt. Ist die Json Antwort z.B. {"response":{"soc":"39.8",
        "range": "207", "timestamp":1734054449}} So muss hier .response.soc eingetragen werden.
        <br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche den aktuellen Ladestand (SoC) darstellt.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Abfrage für Reichweite"
      subtype="text"
      :model-value="vehicle.configuration.range_pattern"
      @update:model-value="updateConfiguration($event, 'configuration.range_pattern')"
    >
      <template #help>
        Zur Analyse der Werte aus dem json-Objekt wird jq benutzt. Ist die Json Antwort z.B. {"response":{"soc":"39.8",
        "range": "207", "timestamp":1734054449}} So muss hier .response.range eingetragen werden.
        <br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche die aktuelle Reichweite darstellt.
      </template>
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
        Berechnet den Ladestand (SoC) während der Ladung. Dies ist notwendig, wenn der SoC nicht über die Schnittstelle
        des Fahrzeugs abgerufen werden kann. Die Berechnung erfolgt über die Ladeleistung und die Ladedauer.
        <br />
        Derzeit u.a. notwendig für Peugeot, Opel, Citroen und DS.
      </template>
    </openwb-base-button-group-input>
    <openwb-base-number-input
      title="Timeout für http-Abfragen"
      subtype="number"
      :model-value="vehicle.configuration.timeout"
      @update:model-value="updateConfiguration($event, 'configuration.timeout')"
    >
      <template #help>
        Ermöglicht es einen Timeout für die http-Abfragen zu setzen. Der Wert wird in Sekunden angegeben. Standardwert
        ist 5 Sekunden sofern kein anderer Wert angegeben ist.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocHttp",
  mixins: [VehicleConfigMixin],
};
</script>
