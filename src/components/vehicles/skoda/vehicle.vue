<template>
  <div class="vehicle-soc-myskoda">
    <openwb-base-alert subtype="info">
      Für diese Anbindung wird ein persönlicher API-Schlüssel für die MyŠkoda Public API benötigt. Dieser wird in
      der <strong>MyŠkoda-App</strong> erzeugt und verwaltet (App-Version mind. 8.16), nicht auf einer Website:
      auf dem Handy mit installierter App
      <a href="https://go.skoda.eu/api-keys" target="_blank" rel="noopener">go.skoda.eu/api-keys</a>
      öffnen, oder den QR-Code aus der
      <a href="https://public.api.connect.skoda-auto.cz/docs" target="_blank" rel="noopener">offiziellen API-Doku</a>
      mit dem Handy scannen. Der Key ist an die beim Erstellen ausgewählten Fahrzeuge gebunden und läuft ab -
      rechtzeitig in der App erneuern.
    </openwb-base-alert>
    <openwb-base-text-input
      title="API-Schlüssel"
      subtype="password"
      required
      :model-value="vehicle.configuration.api_key"
      @update:model-value="updateConfiguration($event, 'configuration.api_key')"
    >
      <template #help>
        In der MyŠkoda-App unter Schlüsselverwaltung erzeugt (App-Version mind. 8.16).
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
