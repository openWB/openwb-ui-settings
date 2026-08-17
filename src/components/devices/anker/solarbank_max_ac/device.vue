<template>
  <div class="device-solarbank_max_ac">
    <openwb-base-heading> Einstellungen für Anker SOLIX Solarbank Max AC</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Es muss in den Einstellungen die Option Modbus TCP aktiviert werden. Nicht alle Anker Produkte unterstützen dies
      bisher. Durch ein Firmware Update könnte diese Option zur Verfügung stehen.
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
      :min="1"
      :max="255"
      :model-value="device.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceAnkerSolarbankMaxAc",
  mixins: [DeviceConfigMixin],
};
</script>
