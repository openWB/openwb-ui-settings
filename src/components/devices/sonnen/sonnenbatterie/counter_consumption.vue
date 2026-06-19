<template>
  <div class="device-sonnenbatterie-counter-consumption">
    <openwb-base-alert subtype="info">
      Diese Komponente liest die Daten des Verbrauchszählers der Sonnenbatterie aus, nicht die EVU-Daten! Es ist ggf.
      ein virtueller Zähler als EVU-Zähler zu konfigurieren, falls kein anderer Zähler vorhanden ist und ausgelesen
      werden kann.
    </openwb-base-alert>
    <openwb-base-alert :subtype="device.configuration.variant !== 3 ? 'danger' : 'info'">
      Diese Komponente kann nur in Verbindung mit der JSON-API v2 verwendet werden, da die anderen Schnittstellen die
      Daten nicht zur Verfügung stellen.
    </openwb-base-alert>
    <openwb-base-heading> Einstellungen für Sonnenbatterie Verbrauchs-Zähler </openwb-base-heading>
    <openwb-base-number-input
      title="Sonnenbatterie-Zähler-ID"
      :model-value="component.configuration.counter_id"
      min="0"
      max="4"
      @update:model-value="updateConfiguration($event, 'configuration.counter_id')"
    >
      <template #help>
        Der erste Verbrauchs-Zähler hat ID 0. Die IDs weiterer Verbrauchs-Zähler werden hochgezählt. Der zweite Zähler
        hat ID 1, der Dritte ID 2 und so fort.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSonnenbatterieCounterConsumption",
  mixins: [ComponentConfigMixin],
};
</script>
