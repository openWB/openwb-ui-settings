<template>
  <div class="device-carlo-gavazzi-counter">
    <openwb-base-alert subtype="info"> ModbusTCP muss aktiviert sein. </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceCarloGavazziCounter",
  mixins: [ComponentConfigMixin],
};
</script>
