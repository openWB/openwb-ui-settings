<template>
  <div class="device-ecoflow-stream">
    <openwb-base-heading> Einstellungen für EcoFlow Stream</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Für die Einbindung des Ecoflow wird ein Access Key und ein Secret Key benötigt. 
      Diese erhält man über die Ecoflow Developer Platform. Dort muss ein Account erstellt werden.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Seriennummer"
      :model-value="device.configuration.serial"
      @update:model-value="updateConfiguration($event, 'configuration.serial')"
    >
      <template #help>
        Seriennummer der Hauptgerätes des Stream Systems. Normalerweise das erste Gerät.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Access Key"
      subtype="password"
      required
      :model-value="device.configuration.access_key"
      @update:model-value="updateConfiguration($event, 'configuration.access_key')"
    >
      <template #help>
        Access Key der Ecoflow Developer Platform.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Secret Key"
      subtype="password"
      required
      :model-value="device.configuration.secret_key"
      @update:model-value="updateConfiguration($event, 'configuration.secret_key')"
    >
      <template #help>
        Secret Key der Ecoflow Developer Platform.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceEcoflowStream",
  mixins: [DeviceConfigMixin],
};
</script>
