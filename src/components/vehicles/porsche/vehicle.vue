<template>
  <div class="vehicle-soc-porsche">
    <openwb-base-text-input
      title="My-Porsche E-Mail (Porsche ID)"
      subtype="email"
      required
      :model-value="vehicle.configuration.email"
      @update:model-value="updateConfiguration($event, 'configuration.email')"
    >
      <template #help>
        E-Mail-Adresse der Porsche ID, mit der Ihr Euch in der My-Porsche-App bzw. auf my.porsche.com anmeldet.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="My-Porsche Passwort"
      subtype="password"
      required
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help> Passwort der Porsche ID. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Fahrgestellnummer (VIN)"
      subtype="text"
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help>
        Optional. Nur nötig, wenn mehrere Fahrzeuge mit der Porsche ID verknüpft sind. Bleibt das Feld leer, wird das
        erste Fahrzeug im Konto verwendet.
      </template>
    </openwb-base-text-input>
    <openwb-base-button-group-input
      title="SoC während der Ladung berechnen"
      :buttons="[
        {
          buttonValue: false,
          text: 'Nein',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'Ja',
          class: 'btn-outline-success',
        },
      ]"
      :model-value="vehicle.configuration.calculate_soc"
      @update:model-value="updateConfiguration($event, 'configuration.calculate_soc')"
    >
      <template #help>
        Berechnet den Ladestand (SoC) während der Ladung aus Ladeleistung und Ladedauer. Nur nötig, wenn der SoC nicht
        oft genug über die Porsche-Schnittstelle abgerufen werden kann.
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocPorsche",
  mixins: [VehicleConfigMixin],
};
</script>
