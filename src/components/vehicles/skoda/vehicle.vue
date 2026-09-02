<template>
  <div class="vehicle-soc-myskoda">
    <openwb-base-alert subtype="info">
      Für diese Anbindung wird ein persönlicher API-Schlüssel für die MyŠkoda Public API benötigt. Diesen unter
      <a href="https://go.skoda.eu/api-keys" target="_blank" rel="noopener">go.skoda.eu/api-keys</a>
      anfordern.
    </openwb-base-alert>
    <openwb-base-text-input
      title="API-Schlüssel"
      subtype="password"
      required
      :model-value="vehicle.configuration.api_key"
      @update:model-value="updateConfiguration($event, 'configuration.api_key')"
    >
      <template #help>
        Persönlicher API-Schlüssel, angefordert unter
        <a href="https://go.skoda.eu/api-keys" target="_blank" rel="noopener">go.skoda.eu/api-keys</a>.
      </template>
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
  name: "VehicleSocMyskoda",
  mixins: [VehicleConfigMixin],
};
</script>
