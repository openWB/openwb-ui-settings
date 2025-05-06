<template>
  <div class="device-thermia-counter">
    <openwb-base-alert subtype="info"> ModbusTCP muss aktiviert sein. </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceThermiaCounter",
  mixins: [ComponentConfigMixin],
};
</script>
