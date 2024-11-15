<template>
  <div class="vehicle-soc-evcc">
    <openwb-base-text-input
      title="EVCC Sponsor Token"
      subtype="password"
      required
      :model-value="vehicle.configuration.sponsor_token"
      @update:model-value="updateConfiguration($event, 'configuration.sponsor_token')"
    >
      <template #help>
        EVCC Sponsor Token angeben, dies ist notwendig um SoC über EVCC abrufen zu können. https://sponsor.evcc.io/
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Benutzername"
      subtype="text"
      required
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
      <template #help> Benutzername beim Fahrzeughersteller. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Kennwort"
      subtype="password"
      required
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help> Kennwort beim Fahrzeughersteller. </template>
    </openwb-base-text-input>
    <openwb-base-select-input
      title="Marke"
      required
      not-selected="Bitte auswählen"
      :options="[
        { value: 'aiways', text: 'Aiways' },
        { value: 'audi', text: 'Audi' },
        { value: 'etron', text: 'Audi e-tron' },
        { value: 'bmw', text: 'BMW' },
        { value: 'dacia', text: 'Dacia' },
        { value: 'fiat', text: 'Fiat' },
        { value: 'ford', text: 'Ford' },
        { value: 'hyundai', text: 'Hyundai' },
        { value: 'jaguar', text: 'Jaguar' },
        { value: 'kia', text: 'Kia' },
        { value: 'landrover', text: 'Landrover' },
        { value: 'mg', text: 'Mg' },
        { value: 'mini', text: 'Mini' },
        { value: 'nissan', text: 'Nissan' },
        { value: 'carwings', text: 'Nissan (Leaf pre 2019)' },
        { value: 'ovms', text: 'OVMS' },
        { value: 'polestar', text: 'Polestar' },
        { value: 'porsche', text: 'Porsche' },
        { value: 'renault', text: 'Renault' },
        { value: 'seat', text: 'Seat' },
        { value: 'cupra', text: 'Seat Cupra' },
        { value: 'skoda', text: 'Škoda' },
        { value: 'enyaq', text: 'Škoda Enyaq' },
        { value: 'smart', text: 'Smart' },
        { value: 'smart-hello', text: 'Smart-Hello' },
        { value: 'template', text: 'Template' },
        { value: 'volvo', text: 'Volvo' },
        { value: 'volvo-connected', text: 'Volvo-Connected' },
        { value: 'vw', text: 'VW' },
        { value: 'id', text: 'VW ID' },
      ]"
      :model-value="vehicle.configuration.vehicle_type"
      @update:model-value="updateConfiguration($event, 'configuration.vehicle_type')"
    >
      <template #help> Marke aus des Fahrzeugs. </template>
    </openwb-base-select-input>
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
  name: "VehicleSocEVCC",
  mixins: [VehicleConfigMixin],
};
</script>
