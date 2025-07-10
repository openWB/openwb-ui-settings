<template>
  <div class="vehicle-soc-skoda">
    <openwb-base-alert subtype="info">
      Beschreibung der Konfiguration und weitere Hinweise im Wiki:
      <a
        href="https://github.com/openWB/core/wiki/SoC-Skoda"
        target="_blank"
        rel="noopener noreferrer"
        >Wiki für SoC-Modul Skoda</a
      >
    </openwb-base-alert>
    <openwb-base-text-input
      title="Benutzername"
      required
      subtype="user"
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
      <template #help> Der Benutzername(Email-Adresse) für die Anmeldung an den Skoda-Servern. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Kennwort"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help> Das Passwort für die Anmeldung an den Skoda-Servern. </template>
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
  name: "VehicleSocVwid",
  mixins: [VehicleConfigMixin],
};
</script>
