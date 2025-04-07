<template>
  <div class="device-algodue-counter">
    <openwb-base-alert subtype="info">
      ModbusTCP muss aktiviert sein. Der Zähler ist auf Modbus-ID 1 und Port 502 vorkonfiguriert.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceAlgodueCounter",
  mixins: [ComponentConfigMixin],
};
</script>
