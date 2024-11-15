<template>
  <div class="vehicle-soc-tronity">
    <openwb-base-text-input
      title="Vehicle ID"
      subtype="text"
      required
      :model-value="vehicle.configuration.vehicle_id"
      @update:model-value="updateConfiguration($event, 'configuration.vehicle_id')"
    >
      <template #help> Vehicle ID aus Tronity angeben. Diese ist in den "Assigned Vehicles" zu finden. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Client ID"
      subtype="text"
      required
      :model-value="vehicle.configuration.client_id"
      @update:model-value="updateConfiguration($event, 'configuration.client_id')"
    >
      <template #help> Client ID aus Tronity angeben. Diese ist in den "Application Settings" zu finden. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Client Secret"
      subtype="password"
      required
      :model-value="vehicle.configuration.client_secret"
      @update:model-value="updateConfiguration($event, 'configuration.client_secret')"
    >
      <template #help>
        Client Secret aus Tronity angeben. Diese ist in den "Application Settings" zu finden. Das Client Secret kann nur
        einmalig abgerufen werden. Ggf. neu erzeugen, womit frühere Client Secrets ungültig werden.
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
        Berechnet den Ladestand (SoC) während der Ladung. Dies ist notwendig, wenn der SoC nicht über die Schnittstelle
        des Fahrzeugs abgerufen werden kann. Die Berechnung erfolgt über die Ladeleistung und die Ladedauer.
        <br />
        Derzeit notwendig für Peugeot, Opel, Citroen und DS.
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocTronity",
  mixins: [VehicleConfigMixin],
};
</script>
