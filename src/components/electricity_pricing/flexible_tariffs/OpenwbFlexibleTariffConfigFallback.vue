<template>
  <div class="flexible-tariff-fallback">
    <openwb-base-alert
      v-if="Object.keys(flexibleTariff.configuration).length == 0"
      subtype="info"
    >
      Der Anbieter "{{ flexibleTariff.name }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für den Anbieter "{{ flexibleTariff.name }}" gefunden. Die Einstellungen
        können als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="flexibleTariff.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfe, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(flexibleTariff.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "./FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffConfigFallback",
  mixins: [FlexibleTariffConfigMixin],
};
</script>
