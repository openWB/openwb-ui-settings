<template>
  <div class="device-powerfox">
    <openwb-base-heading> Einstellungen für Powerfox </openwb-base-heading>
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      required
      :model-value="device.configuration.user"
      @update:model-value="updateConfiguration($event, 'configuration.user')"
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
  name: "DevicePowerfox",
  mixins: [DeviceConfigMixin],
};
</script>
