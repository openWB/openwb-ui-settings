<template>
  <div class="device-avm">
    <openwb-base-heading>Einstellungen für AVM Fritz!Box</openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      required
      :model-value="device.configuration.username"
      @update:model-value="updateConfiguration($event, 'configuration.username')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="device.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
    <openwb-base-text-input
      title="Name"
      subtype="text"
      required
      :model-value="device.configuration.name"
      @update:model-value="updateConfiguration($event, 'configuration.name')"
    />
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerAvm",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
