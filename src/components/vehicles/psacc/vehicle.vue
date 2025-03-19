<template>
  <div class="vehicle-soc-psacc">
    <openwb-base-alert subtype="info">
      Der PSA Car Controller muss auf einem eigenen Host installiert werden, mit Zugangsdaten konfiguriert werden und
      dauerhaft laufen. Die openWB ruft den SoC zu Beginn der Ladung vom PSA Car Controller ab. Während der Ladung
      liefert PSA keine Updates. Daher wird der SoC während der Ladung aus dem Zählerstand berechnet. Ausschlaggebend
      für die Genauigkeit dieser Berechnung sind die beiden Einstellungen "Kapazität der Batterie" und "Wirkungsgrad der
      Ladeelektronik" im Fahrzeug-Profil.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="vehicle.configuration.psacc_server_or_ip"
      @update:model-value="updateConfiguration($event, 'configuration.psacc_server_or_ip')"
    >
      <template #help>Host, auf dem der PSA Car Controller läuft.</template>
    </openwb-base-text-input>
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="vehicle.configuration.psacc_port"
      @update:model-value="updateConfiguration($event, 'configuration.psacc_port')"
    >
      <template #help>Nummer des Ports, den der PSA Car Controller verwendet.</template>
    </openwb-base-number-input>
    <openwb-base-text-input
      title="VIN"
      subtype="text"
      required
      :model-value="vehicle.configuration.vehicle_vin"
      @update:model-value="updateConfiguration($event, 'configuration.vehicle_vin')"
    >
      <template #help>Fahrzeug-Identifizierungsnummer des Fahrzeugs, von dem der SoC abgefragt wird.</template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocPSACC",
  mixins: [VehicleConfigMixin],
};
</script>
