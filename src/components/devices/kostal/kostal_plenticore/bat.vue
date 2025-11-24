<template>
  <div class="device-kostal-plenticore-bat">
    <openwb-base-alert subtype="info">
      Für die aktive Batteriesteuerung muss die Funktion "Extern über Protokoll (Modbus TCP)" in der Nutzeroberfläche
      des Plenticore mit dem Handwerkerzugang aktiviert werden.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceKostalPlenticoreBat",
  mixins: [ComponentConfigMixin],
};
</script>
