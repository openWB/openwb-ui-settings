<template>
  <div class="vehicle-soc-smart-hello">
    <openwb-base-text-input
      title="Benutzername"
      subtype="text"
      required
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    />
    <openwb-base-text-input
      title="Kennwort"
      subtype="password"
      required
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
    <openwb-base-text-input
      title="VIN"
      subtype="text"
      :model-value="vehicle.configuration.VIN"
      @update:model-value="updateConfiguration($event, 'configuration.VIN')"
    >
      <template #help>
        Fahrgestellnummer (VIN) des Fahrzeugs. Notwendig falls mehrere Fahrzeuge im Account des Herstellers vorhanden
        sind.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocSmartHello",
  mixins: [VehicleConfigMixin],
};
</script>
