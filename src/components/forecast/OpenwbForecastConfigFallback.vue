<template>
  <div class="forecast-fallback">
    <openwb-base-alert
      v-if="Object.keys(forecast.configuration || {}).length == 0"
      subtype="info"
    >
      Der Anbieter "{{ forecast.name }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für den Anbieter "{{ forecast.name }}" gefunden. Die Einstellungen koennen
        als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="forecast.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfe, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(forecast.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import ForecastConfigMixin from "./ForecastConfigMixin.vue";

export default {
  name: "OpenwbForecastConfigFallback",
  mixins: [ForecastConfigMixin],
};
</script>
