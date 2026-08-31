<template>
  <div class="consumer-avm">
    <openwb-base-heading>Einstellungen für AVM Fritz!Box</openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      required
      :model-value="consumer.configuration.username"
      @update:model-value="updateConfiguration($event, 'configuration.username')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="consumer.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
    <openwb-base-text-input
      title="Name"
      subtype="text"
      required
      :model-value="consumer.configuration.name"
      @update:model-value="updateConfiguration($event, 'configuration.name')"
    />
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerAvm",
  mixins: [ConsumerConfigMixin],
};
</script>
