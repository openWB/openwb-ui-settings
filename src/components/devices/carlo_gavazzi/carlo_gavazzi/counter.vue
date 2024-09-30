<template>
  <div class="device-carlo-gavazzi-counter">
    <openwb-base-alert subtype="info">
      ModbusTCP muss aktiviert sein. Ausgelesen wird ID 1 auf Port 502.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceCarloGavazziCounter",
  mixins: [ComponentConfigMixin],
};
</script>
