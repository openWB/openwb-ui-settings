<template>
  <div class="device-mqtt-inverter">
    <openwb-base-heading> Einstellungen für MQTT Wechselrichter </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Die folgenden Topics sind für einen reibungslosen Betrieb unbedingt erforderlich:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/pv/{{ component.id }}/get/power </openwb-base-copy-to-clipboard
          ><br />
          PV-Leistung in Watt als Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen. Produzierte Leistung muss ein negatives Vorzeichen haben. (In bestimmten Konstellationen,
          z.B. wenn ein Hybridsystem über einen zweiten Wechselrichter geladen wird, hat die Leistung ein positives
          Vorzeichen.) Beispiel:
          <span class="text-info">-123</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/pv/{{ component.id }}/get/exported </openwb-base-copy-to-clipboard
          ><br />
          Erzeugte Energie in Wh, Zahl mit oder ohne Nachkommastellen (Float, Integer) und einem Punkt als
          Dezimaltrennzeichen, nur positiv<br />
          Beispiel: <span class="text-info">123.45</span>
        </li>
      </ul>
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceMqttInverter",
  mixins: [ComponentConfigMixin],
};
</script>
