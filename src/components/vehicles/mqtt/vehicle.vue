<template>
  <div class="vehicle-soc-mqtt">
    <openwb-base-alert subtype="info">
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/mqtt/vehicle/{{ vehicleId }}/get/soc
          </openwb-base-copy-to-clipboard>
          <br />
          Fahrzeug-SoC mit Nachkommastellen (Float) oder Ganzzahl<br />
          Beispiel: <span class="text-info">89.5</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/mqtt/vehicle/{{ vehicleId }}/get/soc_timestamp
          </openwb-base-copy-to-clipboard>
          <br />
          Zeitstempel des SoCs in s als Unix-Zeitstempel<br />
          Diese Info ist optional. Wird kein Wert für das Topic veröffentlicht, wird bei der Abfrage automatisch der
          aktuelle Zeitstempel gesetzt.<br />
          Beispiel: <span class="text-info">1748339524</span>
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/mqtt/vehicle/{{ vehicleId }}/get/range
          </openwb-base-copy-to-clipboard>
          <br />
          Reichweite des Fahrzeugs in km mit Nachkommastellen (Float) oder Ganzzahl<br />
          Diese Info ist optional.<br />
          Beispiel: <span class="text-info">356.5</span>
        </li>
      </ul>
    </openwb-base-alert>
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
        Berechnet den Ladestand (SoC) während der Ladung. Dies ist notwendig, wenn der SoC während der Ladung nicht
        aktualisiert wird. Die Berechnung erfolgt über die Ladeleistung und die Ladedauer.
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocMqtt",
  mixins: [VehicleConfigMixin],
};
</script>
