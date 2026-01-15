<template>
  <div class="vehicle-soc-http">
    <openwb-base-text-input
      title="SoC URL"
      subtype="url"
      required
      :model-value="vehicle.configuration.soc_url"
      @update:model-value="updateConfiguration($event, 'configuration.soc_url')"
    >
      <template #help>
        Es wird vom Server eine Zahl (Float mit Punkt als Dezimaltrennzeichen oder Integer) erwartet, welche den
        aktuellen Ladestand in Prozent (0 bis 100) zurückgibt.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Reichweiten URL"
      subtype="url"
      :model-value="vehicle.configuration.range_url"
      @update:model-value="updateConfiguration($event, 'configuration.range_url')"
    >
      <template #help>
        Es wird vom Server eine Zahl (Float mit Punkt als Dezimaltrennzeichen oder Integer) erwartet, welche die
        aktuelle Reichweite in Kilometern darstellt. Diese Angabe ist optional.
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
        Berechnet den Ladestand (SoC) während der Ladung. Dies ist notwendig, wenn der SoC während der Ladung nicht
        aktualisiert wird. Die Berechnung erfolgt über die Ladeleistung und die Ladedauer.
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocHttp",
  mixins: [VehicleConfigMixin],
};
</script>
