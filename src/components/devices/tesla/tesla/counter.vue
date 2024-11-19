<template>
  <div class="device-tesla-counter">
    <openwb-base-alert subtype="info">
      Je nach Firmware-Version ist nur ein Lastmanagement anhand der Gesamtleistung möglich, da nicht alle
      Firmware-Versionen Phasenströme liefern.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceTeslaCounter",
  mixins: [ComponentConfigMixin],
};
</script>
