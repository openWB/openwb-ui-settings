<template>
  <div class="device-json-counter">
    <openwb-base-heading> Einstellungen für JSON Zähler </openwb-base-heading>
    <openwb-base-text-input
      title="Abfrage für Leistung"
      subtype="text"
      required
      :model-value="component.configuration.jq_power"
      @update:model-value="updateConfiguration($event, 'configuration.jq_power')"
    >
      <template #help>
        Zur Analyse der Werte aus dem json-Objekt wird jq benutzt. Ist die Json Antwort z.B. {"PowerInstalledPeak":4655,
        "PowerProduced":132, "PowerOut":897.08172362555717, "PowerSelfSupplied":234.9182763744428} So muss hier
        .PowerOut eingetragen werden.
        <br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche die aktuelle Leistung in Watt darstellt.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Abfrage für Zählerstand Bezug"
      subtype="text"
      :model-value="component.configuration.jq_imported"
      @update:model-value="updateConfiguration($event, 'configuration.jq_imported')"
    >
      <template #help> Wird dieses Feld leer gelassen, dann werden Zählerstände intern simuliert. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Abfrage für Zählerstand Einspeisung"
      subtype="text"
      :model-value="component.configuration.jq_exported"
      @update:model-value="updateConfiguration($event, 'configuration.jq_exported')"
    >
      <template #help> Wird dieses Feld leer gelassen, dann werden Zählerstände intern simuliert. </template>
    </openwb-base-text-input>
    <openwb-base-alert subtype="info">
      Werden sowohl Leistung als auch Strom auf den Einzelphasen leer gelassen, erfolgt das Lastmanagement am EVU-Punkt
      nur anhand der Gesamtleistung am EVU-Punkt. Wird der Zähler als Zwischenzähler verwendet, wird in diesem Fall kein
      Lastmanagement durchgeführt.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Abfrage für Leistung auf Phase 1"
      subtype="text"
      :model-value="component.configuration.jq_power_l1"
      @update:model-value="updateConfiguration($event, 'configuration.jq_power_l1')"
    />
    <openwb-base-text-input
      title="Abfrage für Leistung auf Phase 2"
      subtype="text"
      :model-value="component.configuration.jq_power_l2"
      @update:model-value="updateConfiguration($event, 'configuration.jq_power_l2')"
    />
    <openwb-base-text-input
      title="Abfrage für Leistung auf Phase 3"
      subtype="text"
      :model-value="component.configuration.jq_power_l3"
      @update:model-value="updateConfiguration($event, 'configuration.jq_power_l3')"
    />

    <openwb-base-text-input
      title="Abfrage für Strom auf Phase 1"
      subtype="text"
      :model-value="component.configuration.jq_current_l1"
      @update:model-value="updateConfiguration($event, 'configuration.jq_current_l1')"
    />
    <openwb-base-text-input
      title="Abfrage für Strom auf Phase 2"
      subtype="text"
      :model-value="component.configuration.jq_current_l2"
      @update:model-value="updateConfiguration($event, 'configuration.jq_current_l2')"
    />
    <openwb-base-text-input
      title="Abfrage für Strom auf Phase 3"
      subtype="text"
      :model-value="component.configuration.jq_current_l3"
      @update:model-value="updateConfiguration($event, 'configuration.jq_current_l3')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceJsonCounter",
  mixins: [ComponentConfigMixin],
};
</script>
