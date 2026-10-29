<template>
  <div class="consumer-tasmota">
    <openwb-base-heading>Einstellungen für Tasmota</openwb-base-heading>
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
  name: "ConsumerTasmota",
  mixins: [ConsumerConfigMixin],
};
</script>
