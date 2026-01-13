<template>
  <div class="web-theme-fallback">
    <openwb-base-alert
      v-if="Object.keys(webTheme.configuration).length == 0"
      subtype="info"
    >
      Das Web Theme "{{ webTheme.name }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für das Web Theme "{{ webTheme.name }}" gefunden. Die Einstellungen können
        als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Theme Konfiguration"
        subtype="json"
        :model-value="webTheme.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfe, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(webTheme.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import WebThemeConfigMixin from "./WebThemeConfigMixin.vue";

export default {
  name: "WebThemeFallback",
  mixins: [WebThemeConfigMixin],
};
</script>
