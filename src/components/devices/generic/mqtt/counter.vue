<template>
  <div class="device-mqtt-counter">
    <openwb-base-heading> Einstellungen für MQTT Zähler </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Die folgenden Topics sind für einen reibungslosen Betrieb unbedingt erforderlich:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/counter/{{ component.id }}/get/power </openwb-base-copy-to-clipboard
          ><br />
          Bezugsleistung in Watt, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, positiv Bezug, negativ Einspeisung<br />
          Beispiel: <span class="text-info">-123.45</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/counter/{{ component.id }}/get/imported </openwb-base-copy-to-clipboard
          ><br />
          Bezogene Energie in Wh, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, nur positiv<br />
          Beispiel: <span class="text-info">123.45</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/counter/{{ component.id }}/get/exported </openwb-base-copy-to-clipboard
          ><br />
          Eingespeiste Energie in Wh, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, nur positiv<br />
          Beispiel: <span class="text-info">123.45</span>
        </li>
      </ul>
      Ströme je Phase sind für phasenbasiertes Lastmanagement unbedingt erforderlich, sonst erfolgt das Lastmanagement
      ausschließlich auf Basis der Gesamtleistung am EVU-Punkt:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/counter/{{ component.id }}/get/currents </openwb-base-copy-to-clipboard
          ><br />
          Array mit den Strömen je Phase in Ampere, mit Nachkommastellen (Float), positiv Bezug, negativ Einspeisung<br />
          Beispiel: <span class="text-info">[1.2,2.3,-2.1]</span>
        </li>
      </ul>
      Die Netzfrequenz, Spannungen, Leistungen und Leistungsfaktoren jeder Phase werden ausschließlich zu Anzeigezwecken
      verwendet:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/counter/{{ component.id }}/get/frequency </openwb-base-copy-to-clipboard
          ><br />
          Netzfrequenz in Hz, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen<br />
          Beispiel: <span class="text-info">50.12</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/counter/{{ component.id }}/get/voltages </openwb-base-copy-to-clipboard
          ><br />
          Array mit den Spannungen je Phase in Volt, mit Nachkommastellen (Float)<br />
          Beispiel: <span class="text-info">[222.2,223.3,222.3]</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/counter/{{ component.id }}/get/powers </openwb-base-copy-to-clipboard
          ><br />
          Array mit den Leistungen je Phase in Watt, mit Nachkommastellen (Float)<br />
          Beispiel: <span class="text-info">[12.3,23.4,-12.3]</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/counter/{{ component.id }}/get/power_factors </openwb-base-copy-to-clipboard
          ><br />
          Array mit den Leistungsfaktoren je Phase, mit Nachkommastellen (Float), Wertebereich -1 bis 1<br />
          Beispiel: <span class="text-info">[0.95,0.96,-0.95]</span>
        </li>
      </ul>
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceMqttCounter",
  mixins: [ComponentConfigMixin],
};
</script>
