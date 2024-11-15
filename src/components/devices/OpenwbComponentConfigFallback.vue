<template>
  <div class="component-fallback">
    <openwb-base-alert
      v-if="Object.keys(component.configuration).length == 0"
      subtype="info"
    >
      Der Komponenten-Typ "{{ component.type }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für den Komponenten-Typ "{{ component.type }}" gefunden. Die Einstellungen
        können als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="component.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfen Sie, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(component.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import ComponentConfigMixin from "./ComponentConfigMixin.vue";

export default {
  name: "ComponentFallback",
  mixins: [ComponentConfigMixin],
};
</script>
