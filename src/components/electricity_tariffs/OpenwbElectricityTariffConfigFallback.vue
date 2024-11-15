<template>
  <div class="backup-cloud-fallback">
    <openwb-base-alert subtype="warning">
      Es wurde keine Konfigurationsseite für den Anbieter "{{ electricityTariff.name }}" gefunden. Die Einstellungen
      können als JSON direkt bearbeitet werden.
    </openwb-base-alert>
    <openwb-base-textarea
      title="Konfiguration"
      subtype="json"
      :model-value="electricityTariff.configuration"
      @update:model-value="updateConfiguration($event, 'configuration')"
    >
      <template #help> Bitte prüfen Sie, ob die Eingaben richtig interpretiert werden. </template>
    </openwb-base-textarea>
    <openwb-base-alert subtype="info">
      <pre>{{ JSON.stringify(electricityTariff.configuration, undefined, 2) }}</pre>
    </openwb-base-alert>
  </div>
</template>

<script>
import ElectricityTariffConfigMixin from "./ElectricityTariffConfigMixin.vue";

export default {
  name: "ElectricityTariffConfigFallback",
  mixins: [ElectricityTariffConfigMixin],
};
</script>
