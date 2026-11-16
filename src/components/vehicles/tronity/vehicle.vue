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
    <openwb-vehicle-calculate-soc-input
      :model-value="vehicle.configuration.calculate_soc"
      @update:model-value="updateConfiguration($event, 'configuration.calculate_soc')"
    >
      Derzeit notwendig für Peugeot, Opel, Citroen und DS.
    </openwb-vehicle-calculate-soc-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";
import OpenwbVehicleCalculateSocInput from "../OpenwbVehicleCalculateSocInput.vue";

export default {
  name: "VehicleSocTronity",
  components: { OpenwbVehicleCalculateSocInput },
  mixins: [VehicleConfigMixin],
};
</script>
