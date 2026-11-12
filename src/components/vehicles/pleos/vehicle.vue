<template>
  <div class="vehicle-soc-pleos">
    <openwb-base-alert subtype="info">
      Client-ID und Client-Secret erhältst Du über die Anleitung
      <a
        href="https://document.pleos.ai/en/api-reference/vehicle-data-api/getting-started/for-private-users/request-my-vehicle-api-key"
        target="_blank"
        rel="noopener noreferrer"
      >
        Request my Vehicle API Key
      </a>
      im Pleos Playground (Anmeldung mit dem eigenen Hyundai-/Kia-/Genesis-Account erforderlich).
    </openwb-base-alert>
    <openwb-base-select-input
      title="Hersteller"
      required
      not-selected="Bitte auswählen"
      :options="[
        { value: 'hyundai', text: 'Hyundai' },
        { value: 'kia', text: 'Kia' },
        { value: 'genesis', text: 'Genesis' },
      ]"
      :model-value="vehicle.configuration.brand"
      @update:model-value="updateConfiguration($event, 'configuration.brand')"
    />
    <openwb-base-text-input
      title="Client-ID"
      required
      :model-value="vehicle.configuration.client_id"
      @update:model-value="updateConfiguration($event, 'configuration.client_id')"
    >
      <template #help>
        Client-ID aus dem Pleos Playground (pleos.ai/playground, Bereich "My Vehicle Data API", mit dem
        Hyundai-/Kia-/Genesis-Account anmelden).
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Client-Secret"
      required
      subtype="password"
      :model-value="vehicle.configuration.client_secret"
      @update:model-value="updateConfiguration($event, 'configuration.client_secret')"
    >
      <template #help> Client-Secret aus dem Pleos Playground, zusammen mit der Client-ID angezeigt. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="VIN"
      required
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help> Die Fahrgestellnummer des Fahrzeugs. </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocPleos",
  mixins: [VehicleConfigMixin],
};
</script>
