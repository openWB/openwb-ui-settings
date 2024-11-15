<template>
  <div class="device-tesla">
    <openwb-base-heading> Einstellungen für Tesla </openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="E-Mail"
      subtype="email"
      required
      :model-value="device.configuration.email"
      @update:model-value="updateConfiguration($event, 'configuration.email')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="device.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceTesla",
  mixins: [DeviceConfigMixin],
};
</script>
