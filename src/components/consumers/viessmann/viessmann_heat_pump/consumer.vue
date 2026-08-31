<template>
  <div class="consumer-viessmann-heat-pump">
    <openwb-base-heading>Einstellungen für Viessmann Wärmepumpe</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Vitalcal 200-s Wärmepumpe mit LON Kommunikationsmodul und Vitogate 300. Wenn die Einschaltbedingung erreicht ist,
      wird Komfortfunktion "Einmalige Warmwasserbereitung" außerhalb des Zeitprogramms gestartet. Für die "Einmalige
      Warmwasserbereitung" wird der Warmwassertemperatur-Sollwert 2 genutzt. In der Wärmepumpe kann eingestellt werden,
      ob für diese Funktion die Elektroheizung (Heizstab) benutzt werden soll.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="consumer.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="consumer.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerViessmannHeatPump",
  mixins: [ConsumerConfigMixin],
};
</script>
