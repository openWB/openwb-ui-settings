<template>
  <div class="device-json-inverter">
    <openwb-base-heading> Einstellungen für JSON Wechselrichter </openwb-base-heading>
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
        Dezimaltrennzeichen erwartet, welche die aktuelle Leistung in Watt darstellt. Produzierte Leistung muss ein
        negatives Vorzeichen haben. (In bestimmten Konstellationen, z.B. wenn ein Hybridsystem über einen zweiten
        Wechselrichter geladen wird, hat die Leistung ein positives Vorzeichen.)
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Abfrage für Zählerstand"
      subtype="text"
      :model-value="component.configuration.jq_exported"
      @update:model-value="updateConfiguration($event, 'configuration.jq_exported')"
    >
      <template #help> Wird dieses Feld leer gelassen, dann werden Zählerstände intern simuliert. </template>
    </openwb-base-text-input>

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
import ConsumerComponentConfigMixin from "../../ConsumerComponentConfigMixin.vue";

export default {
  name: "DeviceJsonInverter",
  mixins: [ConsumerComponentConfigMixin],
};
</script>
