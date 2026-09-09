<template>
  <div class="consumer-ratiotherm">
    <openwb-base-heading>Einstellungen für Ratiotherm Wärmepumpe</openwb-base-heading>
    <openwb-base-alert subtype="info">Anschluss via Modbus RTU (Elfin-EE11) auf CAN-EZ3</openwb-base-alert>
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
      :model-value="consumer.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerRatiotherm",
  mixins: [ConsumerConfigMixin],
};
</script>
