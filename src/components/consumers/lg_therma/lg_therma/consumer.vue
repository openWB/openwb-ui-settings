<template>
  <div class="consumer-lg-therma">
    <openwb-base-heading> Einstellungen für LG Therma V </openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="consumer.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :min="1"
      :max="255"
      :model-value="consumer.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerLgTherma",
  mixins: [ConsumerConfigMixin],
};
</script>
