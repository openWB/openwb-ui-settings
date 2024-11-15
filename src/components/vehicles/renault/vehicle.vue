<template>
  <div class="vehicle-soc-renault">
    <openwb-base-text-input
      title="Benutzername"
      required
      subtype="user"
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
      <template #help> Der Benutzername für die Anmeldung an den Renault-Servern. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Kennwort"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help> Das Passwort für die Anmeldung an den Renault-Servern. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Land"
      required
      :model-value="vehicle.configuration.country"
      @update:model-value="updateConfiguration($event, 'configuration.country')"
    >
      <template #help> Land des Fahrzeugs, z.b. DE für Deutschland. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="VIN"
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help>
        Die Fahrgestellnummer des Fahrzeugs falls mehrere Fahrzeuge im Account vorhanden sind.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocRenault",
  mixins: [VehicleConfigMixin],
};
</script>
