<template>
  <!-- Einstellungen sind vorbelegt und sollen nicht im UI angezeigt werden -->
  <div class="device-zendure-counter"></div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceZendureCounter",
  mixins: [ComponentConfigMixin],
};
</script>
