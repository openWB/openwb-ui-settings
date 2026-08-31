<template>
  <div class="consumer-elwae">
    <openwb-base-heading> Einstellungen für my-PV Elwa2 Heizstab</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Im Web Frontend des Heizstabs muss unter "Steuerungs-Einstellungen" der Parameter "Ansteuerungs-Typ = Modbus TCP"
      und "Zeitablauf Ansteuerung = 120 Sek" gesetzt werden. Für die Ausschaltschwelle werden 500W und die
      Ausschaltverzögerung 180s empfohlen, um die Regelung von Elwa nicht zu stören. Das minimale Regelintervall sollte
      auf 30 s (0,5 min) gestellt werden.
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
  name: "ConsumerMyPvElwaE",
  mixins: [ConsumerConfigMixin],
};
</script>
