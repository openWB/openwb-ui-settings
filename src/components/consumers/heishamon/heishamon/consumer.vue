<template>
  <div class="consumer-heishamon">
    <openwb-base-heading> Einstellungen für Panasonic Wärmepumpe über HeishaMon </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Die Messwerte werden lokal über HeishaMon ausgelesen, die Wärmepumpe wird nicht gesteuert. Es wird nur
      <code>Heat_Power_Consumption</code> verwendet.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    >
      <template #help> IP-Adresse oder Hostname von HeishaMon, ohne http:// und ohne /json. </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerHeishaMon",
  mixins: [ConsumerConfigMixin],
};
</script>
