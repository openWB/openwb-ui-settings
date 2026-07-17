<template>
  <div class="device-enecess-ecomain">
    <openwb-base-heading> Einstellungen für enecess EcoMain </openwb-base-heading>
    <openwb-base-alert subtype="info"> Softwareversion 138 oder höher ist erforderlich. </openwb-base-alert>
    <openwb-base-text-input
      title="IP-Adresse / Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="Seriennummer"
      required
      :model-value="device.configuration.serial_number"
      @update:model-value="updateConfiguration($event, 'configuration.serial_number')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceEneCessEcoMain",
  mixins: [DeviceConfigMixin],
};
</script>
