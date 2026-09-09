<template>
  <div class="consumer-generic-mqtt">
    <openwb-base-heading>Einstellungen für MQTT-Verbraucher</openwb-base-heading>
    <openwb-base-alert subtype="info">
      <p>
        Dieses Modul stellt keine aktive Verbindung her und erwartet MQTT-Daten auf den passenden Topics. Die
        Konfiguration erfolgt primär über die MQTT-Datenstruktur.
      </p>
      <p>Die folgenden Topics sind für einen reibungslosen Betrieb unbedingt erforderlich:</p>
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/get/power
          </openwb-base-copy-to-clipboard>
          <br />
          Bezugsleistung in Watt, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, positiv Bezug, negativ Einspeisung<br />
          Beispiel: <span class="text-info">-123.45</span>
        </li>
      </ul>
      Falls keine Werte für die Zählerstände übermittelt werden, berechnet openWB die Zählerstände anhand der Leistung.
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/get/imported
          </openwb-base-copy-to-clipboard>
          <br />
          Bezogene Energie in Wh, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, nur positiv<br />
          Beispiel: <span class="text-info">123.45</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/get/exported
          </openwb-base-copy-to-clipboard>
          <br />
          Eingespeiste Energie in Wh, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, nur positiv<br />
          Beispiel: <span class="text-info">123.45</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/get/currents
          </openwb-base-copy-to-clipboard>
          <br />
          Array mit den Strömen je Phase in Ampere, mit Nachkommastellen (Float), positiv Bezug, negativ Einspeisung<br />
          Beispiel: <span class="text-info">[1.2,2.3,-2.1]</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/get/voltages
          </openwb-base-copy-to-clipboard>
          <br />
          Array mit den Spannungen je Phase in Volt, mit Nachkommastellen (Float)<br />
          Beispiel: <span class="text-info">[222.2,223.3,222.3]</span>
        </li>
      </ul>
      Die Leistungen jeder Phase werden ausschließlich zu Anzeigezwecken verwendet:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/get/powers
          </openwb-base-copy-to-clipboard>
          <br />
          Array mit den Leistungen je Phase in Watt, mit Nachkommastellen (Float)<br />
          Beispiel: <span class="text-info">[12.3,23.4,-12.3]</span>
        </li>
      </ul>
      Das folgenden Topic wird von openWB geschrieben, falls als Verwendung
      <strong>Stufenlos regelbar</strong> ausgewählt wird:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/set/power
          </openwb-base-copy-to-clipboard>
          <br />
          Sollleistung in Watt, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen<br />
          Beispiel: <span class="text-info">-123.45</span>
        </li>
      </ul>
      Das folgenden Topic wird von openWB geschrieben, falls als Verwendung
      <strong>Schaltbar (Ein/Aus)</strong> ausgewählt wird:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/set/switch
          </openwb-base-copy-to-clipboard>
          <br />
          Vorgegebener Schaltzustand, true für ein, false für aus<br />
          Beispiel: <span class="text-info">true</span>
        </li>
      </ul>
      Die folgenden Werte werden von openWB geschrieben, falls als Verwendung
      <strong>Wärmepumpe in Eigensteuerung</strong> ausgewählt wird:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/set/evu_power
          </openwb-base-copy-to-clipboard>
          <br />
          Aktuelle EVU-Leistung in Watt, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen<br />
          Beispiel: <span class="text-info">-123.45</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/set/pv_power
          </openwb-base-copy-to-clipboard>
          <br />
          Aktuelle PV-Leistung in Watt, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen<br />
          Beispiel: <span class="text-info">-123.45</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/set/bat_power
          </openwb-base-copy-to-clipboard>
          <br />
          Aktuelle Batterieleistung in Watt, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen<br />
          Beispiel: <span class="text-info">-123.45</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/set/bat_soc
          </openwb-base-copy-to-clipboard>
          <br />
          Aktueller Batterieladestand in Prozent, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt
          als Dezimaltrennzeichen<br />
          Beispiel: <span class="text-info">75.5</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/set/home_consumption
          </openwb-base-copy-to-clipboard>
          <br />
          Aktueller Hausverbrauch in Watt, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen<br />
          Beispiel: <span class="text-info">-123.45</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ topicPrefix }}/set/cp_power
          </openwb-base-copy-to-clipboard>
          <br />
          Aktuelle Leistung aller Ladepunkte in Watt, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem
          Punkt als Dezimaltrennzeichen<br />
          Beispiel: <span class="text-info">-123.45</span>
        </li>
      </ul>
    </openwb-base-alert>
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerGenericMqtt",
  mixins: [ConsumerDeviceConfigMixin],
  data() {
    return {
      baseTopic: "openWB/set/mqtt/consumer",
    };
  },
  computed: {
    topicPrefix() {
      return `${this.baseTopic}/${this.consumer.id}`;
    },
  },
};
</script>
