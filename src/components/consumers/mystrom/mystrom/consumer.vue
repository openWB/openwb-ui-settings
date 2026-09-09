<template>
  <div class="consumer-mystrom">
    <openwb-base-heading>Einstellungen für MyStrom</openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerMyStrom",
  mixins: [ConsumerConfigMixin],
};
</script>
