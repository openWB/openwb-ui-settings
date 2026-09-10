<template>
  <div class="device-fronius-sunspec">
    <openwb-base-heading> Einstellungen für Fronius (Modbus/SunSpec) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Modbus TCP muss am Wechselrichter aktiviert sein (Fronius Solar.web bzw. lokales Webinterface -> Kommunikation ->
      Modbus).
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
      title="Zähleradresse"
      required
      :model-value="device.configuration.counter_modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.counter_modbus_id')"
    >
      <template #help>
        Die Modbus-Adresse des Smart Meters, zu finden auf der Weboberfläche des Wechselrichters unter Kommunikation ->
        Modbus. Werkseinstellung: 200. Die Wechselrichteradresse selbst ist bei Modbus TCP fest auf 1 definiert und muss
        nicht konfiguriert werden.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceFroniusSunspec",
  mixins: [DeviceConfigMixin],
};
</script>
