<template>
  <div class="io-action-config-fallback">
    <openwb-base-alert
      v-if="Object.keys(ioAction?.configuration).length == 0"
      subtype="info"
    >
      Die I/O-Aktion "{{ ioAction?.name }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für die I/O-Aktion "{{ ioAction?.name }}" gefunden. Die Einstellungen können
        als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="ioAction?.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfe, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(ioAction?.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import OpenwbIoActionConfigMixin from "./OpenwbIoActionConfigMixin.vue";

export default {
  name: "OpenwbIoActionConfigFallback",
  mixins: [OpenwbIoActionConfigMixin],
};
</script>
