<template>
  <div class="device-ovum">
    <openwb-base-heading> Einstellungen für OVUM Wärmepumpe (CubeSpeicher/MPlus) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Modbus TCP muss am Regler unter "Fachmann/SYS/TCP" mit fester IP-Adresse eingerichtet sein.
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
    <openwb-base-select-input
      title="Netzsaldo zusätzlich senden"
      not-selected="Bitte auswählen"
      :options="[
        { value: true, text: 'ja' },
        { value: false, text: 'nein' },
      ]"
      :model-value="device.configuration.send_values"
      required
      @update:model-value="updateConfiguration($event, 'configuration.send_values')"
    >
      <template #help>
        Sendet zusätzlich zur Leistungsvorgabe den aktuellen Netzsaldo, damit geräteeigene Anzeigen
        (PV-Watch Messwert, Autarkiegrad) auch bei aktiver externer Steuerung sinnvolle Werte zeigen.
        Ohne Einfluss auf die eigentliche Leistungsregelung.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerOvum",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>