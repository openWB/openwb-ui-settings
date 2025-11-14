<template>
  <div class="device-batterx-bat">
    <openwb-base-alert subtype="info">
      Der BatterX Speicher kann die Speicherentladung bei aktiver Speichersteuerung nur komplett sperren. Der teilweise
      Ausgleich durch Übergabe einer Entladeleistung an den Speicher ist nicht möglich.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceBatterXBat",
  mixins: [ComponentConfigMixin],
};
</script>
