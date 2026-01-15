<template>
  <div class="io-device-config-fallback">
    <openwb-base-alert
      v-if="Object.keys(ioDevice.configuration).length == 0"
      subtype="info"
    >
      Das I/O-Modul "{{ ioDevice.name }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für das I/O-Modul "{{ ioDevice.name }}" gefunden. Die Einstellungen können
        als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="ioDevice.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfe, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(ioDevice.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import OpenwbIoDeviceConfigMixin from "./OpenwbIoDeviceConfigMixin.vue";

export default {
  name: "OpenwbIoDeviceConfigFallback",
  mixins: [OpenwbIoDeviceConfigMixin],
};
</script>
