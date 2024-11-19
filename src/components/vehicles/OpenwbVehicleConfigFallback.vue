<template>
  <div class="vehicle-fallback">
    <openwb-base-alert
      v-if="Object.keys(vehicle.configuration).length == 0"
      subtype="info"
    >
      Der Fahrzeug-Typ "{{ vehicle.type }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für den Fahrzeug-Typ "{{ vehicle.type }}" gefunden. Die Einstellungen können
        als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="vehicle.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfen Sie, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(vehicle.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import VehicleConfigMixin from "./VehicleConfigMixin.vue";

export default {
  name: "VehicleConfigFallback",
  mixins: [VehicleConfigMixin],
};
</script>
