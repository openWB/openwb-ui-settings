<template>
  <div class="device-venus_c_e">
    <openwb-base-heading> Einstellungen für Marstek Venus C, E </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Es muss ein Modbus-TCP-Adapter eingesetzt werden, um den RS485-Modbus-Port des Speichers mit dem Netzwerk zu
      verbinden.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname des Adapters"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port des Adapters"
      required
      :min="1"
      :max="65535"
      :model-value="device.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceVenusCE",
  mixins: [DeviceConfigMixin],
};
</script>
