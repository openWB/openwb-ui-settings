<template>
  <div class="device-http-inverter">
    <openwb-base-heading> Einstellungen für Http Wechselrichter </openwb-base-heading>
    <openwb-base-text-input
      title="Pfad für Leistung"
      subtype="text"
      required
      pattern="^/[-a-zA-Z0-9@:%_\+.~#?&/=]*"
      :model-value="component.configuration.power_path"
      @update:model-value="updateConfiguration($event, 'configuration.power_path')"
    >
      <template #help>
        Diese Angabe wird an die Server-URL angehängt und muss mit einem Schrägstrich "/" beginnen.<br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche die aktuelle Leistung in Watt darstellt. Produzierte Leistung muss ein
        negatives Vorzeichen haben. (In bestimmten Konstellationen, z.B. wenn ein Hybridsystem über einen zweiten
        Wechselrichter geladen wird, hat die Leistung ein positives Vorzeichen.)
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Pfad für Zählerstand Erzeugung"
      subtype="text"
      pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)"
      :model-value="component.configuration.exported_path"
      @update:model-value="updateConfiguration($event, 'configuration.exported_path')"
    >
      <template #help>
        Diese Angabe wird an die Server-URL angehängt und muss mit einem Schrägstrich "/" beginnen.<br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche den aktuellen absoluten Zählerstand in Wh darstellt.<br />
        Wird dieses Feld leer gelassen, wird der Zählerstand intern simuliert.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceHttpInverter",
  mixins: [ComponentConfigMixin],
};
</script>
