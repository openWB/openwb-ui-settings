<template>
  <div class="charge-point-openwb-pro">
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="chargePoint.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
  </div>
</template>

<script>
import ChargePointConfigMixin from "../ChargePointConfigMixin.vue";

export default {
  name: "ChargePointOpenwbPro",
  mixins: [ChargePointConfigMixin],
};
</script>
