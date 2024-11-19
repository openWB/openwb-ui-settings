<template>
  <div class="device-discovergy">
    <openwb-base-heading> Einstellungen für Discovergy </openwb-base-heading>
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
  name: "DeviceDiscovergy",
  mixins: [DeviceConfigMixin],
};
</script>
