<template>
  <div class="charge-point-openwb-dc-adapter">
    <openwb-base-text-input
      title="URL"
      subtype="url"
      required
      :model-value="chargePoint.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    />
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      :model-value="chargePoint.configuration.user"
      @update:model-value="updateConfiguration($event, 'configuration.user')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      :model-value="chargePoint.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
  </div>
</template>

<script>
import ChargePointConfigMixin from "../ChargePointConfigMixin.vue";

export default {
  name: "ChargePointOpenwbDcAdapter",
  mixins: [ChargePointConfigMixin],
};
</script>
