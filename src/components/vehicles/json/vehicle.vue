<template>
  <div class="vehicle-soc-json">
    <openwb-base-text-input
      title="SoC URL"
      subtype="url"
      required
      :model-value="vehicle.configuration.soc_url"
      @update:model-value="updateConfiguration($event, 'configuration.soc_url')"
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
        Zur Analyse der Werte aus dem json-Objekt wird jq benutzt. Ist die Json Antwort z.B.
        {"response":{"value":"39.8","timestamp":1734054449}} So muss hier .response.value eingetragen werden.
        <br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche den aktuellen Ladestand (SoC) darstellt.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Reichweiten URL"
      subtype="url"
      :model-value="vehicle.configuration.range_url"
      @update:model-value="updateConfiguration($event, 'configuration.range_url')"
    >
      <template #help>
        Es wird eine komplette URL erwartet mit Angaben zum Protokoll, IP oder Hostnamen, optional einem Port und einem
        Pfad. Die Antwort muss ein json-Objekt sein. Beispiel: http://192.168.1.1:8080/json?data=1. Diese Angabe ist
        optional.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Abfrage für Reichweite"
      subtype="text"
      :model-value="vehicle.configuration.range_pattern"
      @update:model-value="updateConfiguration($event, 'configuration.range_pattern')"
    >
      <template #help>
        Zur Analyse der Werte aus dem json-Objekt wird jq benutzt. Ist die Json Antwort z.B.
        {"response":{"value":"39.8","timestamp":1734054449}} So muss hier .response.value eingetragen werden.
        <br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche die aktuelle Reichweite darstellt.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocHttp",
  mixins: [VehicleConfigMixin],
};
</script>
