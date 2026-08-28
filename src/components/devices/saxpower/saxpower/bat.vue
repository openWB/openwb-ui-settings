<template>
  <div class="device-saxpower-bat">
    <openwb-base-alert subtype="info">
      Um die aktive Speichersteuerung zu nutzen müssen Register 43/44 vom Saxpower
      Support freigeschaltet werden. Hierfür wird die Seriennummer benötigt.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSaxpowerBat",
  mixins: [ComponentConfigMixin],
};
</script>
