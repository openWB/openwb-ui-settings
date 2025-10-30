<template>
  <div class="vehicle-soc-homeassistant">
    <openwb-base-text-input
      title="URL"
      subtype="url"
      required
      :model-value="vehicle.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    >
      <template #help>
        Es wird eine komplette URL erwartet mit Angaben zum Protokoll, IP oder Hostnamen und idealerweise Port.
        Beispiel: http://192.168.1.1:8123
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Entitäts ID"
      subtype="text"
      required
      :model-value="vehicle.configuration.entity_id"
      @update:model-value="updateConfiguration($event, 'configuration.entity_id')"
    >
      <template #help>
        Die Entitäts ID findet sich im HomeAssistant unter 
        „Einstellungen“ → „Geräte & Dienste“ → im oberen Reiter „Entitäten“
        auswählen
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Token"
      subtype="text"
      :model-value="vehicle.configuration.token"
      @update:model-value="updateConfiguration($event, 'configuration.token')"
    >
      <template #help>
        Das Token kann in HomeAssistant hier erstellt werden:<br />
        „Dein Profil“ → oberer Reiter „Sicherheit“ → ganz unten „Langlebiges Zugriffstoken erstellen“
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocHomeAssistant",
  mixins: [VehicleConfigMixin],
};
</script>
