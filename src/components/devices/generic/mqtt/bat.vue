<template>
  <div class="device-mqtt-bat">
    <openwb-base-heading> Einstellungen für MQTT Batteriespeicher </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Die folgenden Topics sind für einen reibungslosen Betrieb unbedingt erforderlich:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/mqtt/bat/{{ component.id }}/get/power
          </openwb-base-copy-to-clipboard>
          <br />
          Speicherleistung in Watt, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, positiv Ladung, negativ Entladung<br />
          Beispiel: <span class="text-info">-123</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/mqtt/bat/{{ component.id }}/get/soc
          </openwb-base-copy-to-clipboard>
          <br />
          Ladestand des Speichers, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, gültige Werte 0 bis 100<br />
          Beispiel: <span class="text-info">95</span>
        </li>
      </ul>
      Falls keine Werte für die Zählerstände übermittelt werden, berechnet openWB die Zählerstände anhand der Leistung.
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/mqtt/bat/{{ component.id }}/get/imported
          </openwb-base-copy-to-clipboard>
          <br />
          Geladene Energie in Wh, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, nur positiv<br />
          Beispiel: <span class="text-info">123.45</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/mqtt/bat/{{ component.id }}/get/exported
          </openwb-base-copy-to-clipboard>
          <br />
          Entladene Energie in Wh, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, nur positiv<br />
          Beispiel: <span class="text-info">123.45</span>
        </li>
      </ul>
      Ströme je Phase sind optional, jedoch für phasenbasiertes Lastmanagement in Verbindung mit einem virtuellen Zähler
      unbedingt erforderlich. Ansonsten erfolgt das Lastmanagement ausschließlich auf Basis der Gesamtleistung an diesem
      Zähler:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/mqtt/bat/{{ component.id }}/get/currents
          </openwb-base-copy-to-clipboard>
          <br />
          Array mit den Strömen je Phase in Ampere, mit Nachkommastellen (Float), positiv Bezug, negativ Einspeisung<br />
          Beispiel: <span class="text-info">[1.2,2.3,-2.1]</span>
        </li>
      </ul>
    </openwb-base-alert>
    <openwb-base-heading> Optionale Einstellungen </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Wenn der Speicher die aktive Steuerung durch openWB unterstützt, kann die Option "Speicherleistung steuerbar" auf
      "Ja" gesetzt werden. Der Modus, um die Speicher-Entladung ins Fahrzeug zu steuern, kann in den übergreifenden
      Ladeeinstellungen gesetzt werden. Über folgendes Topic wird dem Speicher die Entladeleistung mitgeteilt.
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/mqtt/bat/{{ component.id }}/set/power_limit
          </openwb-base-copy-to-clipboard>
          <br />
          Entladeleistung in Watt (Float), die im Speicher gesetzt werden muss.<br />
          Beispiel: <span class="text-info">123.0</span>
        </li>
      </ul>
    </openwb-base-alert>
    <openwb-base-button-group-input
      title="Speicherleistung steuerbar"
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
      :model-value="component.configuration.power_limit_controllable"
      @update:model-value="updateConfiguration($event, 'configuration.power_limit_controllable')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceMqttBat",
  mixins: [ComponentConfigMixin],
};
</script>
