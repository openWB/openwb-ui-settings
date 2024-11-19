<template>
  <div class="device-fems">
    <openwb-base-heading> Einstellungen für openEMS, Fenecon FEMS, CENTURIO 10, Kaco Hy-Control </openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="device.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help>
        Bei Nutzung von Fenecon FEMS ist das Passwort im Normalfall user, bei Kaco mit Hy-Control ist das Passwort meist
        admin.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceFems",
  mixins: [DeviceConfigMixin],
};
</script>
