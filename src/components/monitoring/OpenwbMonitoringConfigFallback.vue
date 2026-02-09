<template>
  <div class="monitoring-fallback">
    <openwb-base-alert
      v-if="Object.keys(monitoring.configuration).length == 0"
      subtype="info"
    >
      Der Anbieter "{{ monitoring.name }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für den Anbieter "{{ monitoring.name }}" gefunden. Die Einstellungen können
        als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="monitoring.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfe, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(monitoring.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import MonitoringConfigMixin from "./MonitoringConfigMixin.vue";

export default {
  name: "MonitoringConfigFallback",
  mixins: [MonitoringConfigMixin],
};
</script>
