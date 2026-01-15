<template>
  <div class="display-theme-fallback">
    <openwb-base-alert
      v-if="Object.keys(displayTheme.configuration).length == 0"
      subtype="info"
    >
      Das Display-Theme "{{ displayTheme.name }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für das Display-Theme "{{ displayTheme.name }}" gefunden. Die Einstellungen
        können als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="displayTheme.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfe, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(displayTheme.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import DisplayThemeConfigMixin from "./DisplayThemeConfigMixin.vue";

export default {
  name: "DisplayThemeFallback",
  mixins: [DisplayThemeConfigMixin],
};
</script>
