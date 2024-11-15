<template>
  <div class="device-http-bat">
    <openwb-base-heading> Einstellungen für Http Batteriespeicher </openwb-base-heading>
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
        Dezimaltrennzeichen erwartet, welche die aktuelle Leistung in Watt darstellt.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Pfad für Ladestand"
      subtype="text"
      required
      pattern="^/[-a-zA-Z0-9@:%_\+.~#?&/=]*"
      :model-value="component.configuration.soc_path"
      @update:model-value="updateConfiguration($event, 'configuration.soc_path')"
    >
      <template #help>
        Diese Angabe wird an die Server-URL angehängt und muss mit einem Schrägstrich "/" beginnen.<br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche den aktuellen Ladestand (SoC) in Prozent darstellt.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Pfad für Zählerstand laden"
      subtype="text"
      pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)"
      :model-value="component.configuration.imported_path"
      @update:model-value="updateConfiguration($event, 'configuration.imported_path')"
    >
      <template #help>
        Diese Angabe wird an die Server-URL angehängt und muss mit einem Schrägstrich "/" beginnen.<br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche den aktuellen absoluten Zählerstand in Wh darstellt.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Pfad für Zählerstand entladen"
      subtype="text"
      pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)"
      :model-value="component.configuration.exported_path"
      @update:model-value="updateConfiguration($event, 'configuration.exported_path')"
    >
      <template #help>
        Diese Angabe wird an die Server-URL angehängt und muss mit einem Schrägstrich "/" beginnen.<br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche den aktuellen absoluten Zählerstand in Wh darstellt.<br />
        Wird dieses Feld leer gelassen, werden keine Phasenströme ermittelt und es kann kein Lastmanagement berechnet
        werden!
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceHttpBat",
  mixins: [ComponentConfigMixin],
};
</script>
