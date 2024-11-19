<template>
  <div class="device-janitza-counter">
    <openwb-base-alert subtype="info">
      ModbusTCP muss im Janitza auf Port 502 aktiv und die ID auf "1" eingestellt sein.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceJanitzaBat",
  mixins: [ComponentConfigMixin],
};
</script>
