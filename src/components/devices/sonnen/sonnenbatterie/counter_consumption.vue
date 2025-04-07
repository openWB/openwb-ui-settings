<template>
  <div class="device-sonnenbatterie-counter-consumption">
    <openwb-base-alert subtype="info">
      Diese Komponente liest die Daten des Verbrauchszählers der Sonnenbatterie aus, nicht die EVU-Daten! Es ist ggf.
      ein virtueller Zähler als EVU-Zähler zu konfigurieren, falls kein anderer Zähler vorhanden ist und ausgelesen
      werden kann.
    </openwb-base-alert>
    <openwb-base-alert subtype="device.configuration.variant !== 3 ? 'danger' : 'info'">
      Diese Komponente kann nur in Verbindung mit der JSON-API v2 verwendet werden, da die anderen Schnittstellen die
      Daten nicht zur Verfügung stellen.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSonnenbatterieCounterConsumption",
  mixins: [ComponentConfigMixin],
};
</script>
