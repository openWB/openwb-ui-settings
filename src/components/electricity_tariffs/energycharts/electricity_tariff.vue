<template>
  <div class="electricity-tariff-energycharts">
    <openwb-base-alert subtype="info">
      Börsenstrompreise von Energy Charts (energy-charts.info)<br />
      Die Rohdaten werden von Wissenschaftlern des Fraunhofer-Instituts für Solare Energiesysteme ISE aus zahlreichen
      Quellen stündlich oder täglich abgerufen und für die Darstellung aufbereitet.
    </openwb-base-alert>
    <openwb-base-select-input
      title="Land"
      not-selected="Bitte auswählen"
      :options="[
        { value: 'DE-LU', text: 'Deutschland' },
        { value: 'AT', text: 'Österreich' },
        { value: 'CH', text: 'Schweiz' },
      ]"
      :model-value="electricityTariff.configuration.country"
      @update:model-value="updateConfiguration($event, 'configuration.country')"
    />
    <openwb-base-number-input
      title="Aufschlag zum Börsenstrompreis"
      :min="0"
      :step="0.001"
      :precision="3"
      required
      unit="ct/kWh"
      :model-value="electricityTariff.configuration.surcharge"
      @update:model-value="updateConfiguration(parseFloat($event.toFixed(3)), 'configuration.surcharge')"
    >
      <template #help>
        Die Auswahl (Energy-Charts) kann für alle Stromanbieter ausgewählt werden, die die Börsenstrompreise in einem
        variablen/dynamischen Tarif an die Kunden weitergeben. Das Modul soll es ermöglichen, dass zu tagesaktuellen
        Strompreisen unter Berücksichtigung eines Aufschlags zu günstigen Zeiten automatisch geladen werden kann und
        somit die Preisschwankungen an der Börse optimal ausgenutzt werden.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ElectricityTariffConfigMixin from "../ElectricityTariffConfigMixin.vue";

export default {
  name: "ElectricityTariffEnergyCharts",
  mixins: [ElectricityTariffConfigMixin],
};
</script>
