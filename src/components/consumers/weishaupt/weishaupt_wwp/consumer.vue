<template>
  <div class="consumer-weishaupt-wwp">
    <openwb-base-heading> Einstellungen für Weishaupt Wärmepumpe (WWP) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Gilt für die WWP-Baureihe; die ältere, SG-Ready-only WPM-Generation wird hiervon nicht abgedeckt.
    </openwb-base-alert>
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
  name: "ConsumerWeishauptWwp",
  mixins: [ConsumerConfigMixin],
};
</script>
