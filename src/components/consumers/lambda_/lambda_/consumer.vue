<template>
  <div class="device-lambda">
    <openwb-base-heading>Einstellungen für Lambda Wärmepumpe</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Im Web Frontend des Heizstabs muss unter "Steuerungs-Einstellungen" der Parameter "Ansteuerungs-Typ = Modbus TCP"
      und "Zeitablauf Ansteuerung = 120 Sek" gesetzt werden. Für die Ausschaltschwelle werden 500W und die
      Ausschaltverzögerung 180s empfohlen, um die Regelung von Acthor nicht zu stören.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="device.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="device.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-number-input
      title="Vorzeichen Leistungswert"
      required
      :min="-1"
      :max="1"
      :model-value="device.configuration.sign"
      @update:model-value="updateConfiguration($event, 'configuration.sign')"
    >
      <template #help>
        Je nach Gerät ist die Leistung positiv oder negativ. Standard ist 1, bei invertierten Werten -1 setzen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerLambda",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
