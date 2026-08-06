<template>
  <div class="device-openwb-flex-local">
    <openwb-base-heading> Einstellungen für openWB-Flex-Local </openwb-base-heading>
  </div>
  <openwb-base-alert subtype="info"> Es können maximal 8 Zähler gleichzeitig ausgelesen werden. </openwb-base-alert>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceOpenwbFlexLocal",
  mixins: [DeviceConfigMixin],
};
</script>
