<template>
  <div class="device-mqtt">
    <openwb-base-heading>Einstellungen für MQTT</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Das MQTT Modul stellt keine aktive Verbindung her, sondern erwartet, dass die Daten an die angegebenen Topics im
      Broker gesendet werden. Alle Daten sind als gültiges JSON zu senden! Zahlen mit Nachkommastellen (Float) müssen
      einen Punkt als Dezimaltrenner verwenden (internationales Format). <br />
      Ab Version 2.1.8 wurden die Topics überarbeitet. Die bisherigen Topics openWB/set/bat/id/get/...,
      openWB/set/counter/id/get/... und openWB/set/pv/id/get/... bleiben aus Gründen der Abwärtskompatibilität weiterhin
      nutzbar. Es erscheint jedoch eine entsprechende Fehlermeldung. Wir empfehlen, auf die neuen Topics umzusteigen.
      Dies ermöglicht die Beseitigung von Einschränkungen, wie z. B. die fehlende Verrechnung bei Hybrid-Systemen oder
      die Berechnung fehlender Werte, wie der Phasen-Leistung aus Spannung und Stromstärken.
    </openwb-base-alert>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceMqtt",
  mixins: [DeviceConfigMixin],
};
</script>
