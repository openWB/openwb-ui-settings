<template>
  <div class="consumer-generic-mqtt">
    <openwb-base-heading>Einstellungen für MQTT-Verbraucher</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Dieses Modul stellt keine aktive Verbindung her und erwartet MQTT-Daten auf den passenden Topics. Die
      Konfiguration erfolgt primär über die MQTT-Datenstruktur.
    </openwb-base-alert>
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerGenericMqtt",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
