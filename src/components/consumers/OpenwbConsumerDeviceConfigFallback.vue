<template>
  <div class="consumer-device-fallback">
    <openwb-base-alert
      v-if="Object.keys(device.configuration).length == 0"
      subtype="info"
    >
      Der Verbraucher-Typ "{{ device.type }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für den Verbraucher-Typ "{{ device.type }}" gefunden. Die Einstellungen
        können als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="device.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfe, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(device.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "./ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerDeviceFallback",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
