<template>
  <div class="device-shelly">
    <openwb-base-heading> Einstellungen für Shelly PM (Messen & Schalten) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Unterstützt werden theoretisch alle ein- und dreiphasigen Shelly der Generation 1-3. Getestete Modelle sind Shelly
      1pm, 1pm plus, Pro Pro 3EM, Plug S.
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
      :min="1"
      :model-value="device.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    >
    </openwb-base-number-input>
    <openwb-base-number-input
      title="Modbus id"
      :min="1"
      :model-value="device.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
    </openwb-base-number-input>
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerShellyPm",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
