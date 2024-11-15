<template>
  <div class="device-http-counter">
    <openwb-base-heading> Einstellungen für Http Zähler </openwb-base-heading>
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
      title="Pfad für Zählerstand Bezug"
      subtype="text"
      pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)"
      :model-value="component.configuration.imported_path"
      @update:model-value="updateConfiguration($event, 'configuration.imported_path')"
    >
      <template #help>
        Diese Angabe wird an die Server-URL angehängt und muss mit einem Schrägstrich "/" beginnen.<br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche den aktuellen absoluten Zählerstand in Wh darstellt.<br />
        Wird dieses Feld leer gelassen, wird der Zählerstand intern simuliert.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Pfad für Zählerstand Einspeisung"
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
    <openwb-base-text-input
      title="Pfad für Strom Phase 1"
      subtype="text"
      pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)"
      :model-value="component.configuration.current_l1_path"
      @update:model-value="updateConfiguration($event, 'configuration.current_l1_path')"
    >
      <template #help>
        Diese Angabe wird an die Server-URL angehängt und muss mit einem Schrägstrich "/" beginnen.<br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche die aktuelle Stromstärke der 1. Phase in Ampere darstellt.<br />
        Wird dieses Feld leer gelassen, werden keine Phasenströme ermittelt und es kann kein Lastmanagement berechnet
        werden!
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Pfad für Strom Phase 2"
      subtype="text"
      pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)"
      :model-value="component.configuration.current_l2_path"
      @update:model-value="updateConfiguration($event, 'configuration.current_l2_path')"
    >
      <template #help>
        Diese Angabe wird an die Server-URL angehängt und muss mit einem Schrägstrich "/" beginnen.<br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche die aktuelle Stromstärke der 2. Phase in Ampere darstellt.<br />
        Wird dieses Feld leer gelassen, werden keine Phasenströme ermittelt und es kann kein Lastmanagement berechnet
        werden!
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Pfad für Strom Phase 3"
      subtype="text"
      pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)"
      :model-value="component.configuration.current_l3_path"
      @update:model-value="updateConfiguration($event, 'configuration.current_l3_path')"
    >
      <template #help>
        Diese Angabe wird an die Server-URL angehängt und muss mit einem Schrägstrich "/" beginnen.<br />
        Es wird vom Server eine Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
        Dezimaltrennzeichen erwartet, welche die aktuelle Stromstärke der 3. Phase in Ampere darstellt.<br />
        Wird dieses Feld leer gelassen, werden keine Phasenströme ermittelt und es kann kein Lastmanagement berechnet
        werden!
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceHttpCounter",
  mixins: [ComponentConfigMixin],
};
</script>
