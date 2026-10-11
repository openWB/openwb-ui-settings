<template>
  <div class="vehicle-soc-nissanconnect">
    <openwb-base-alert subtype="info">
      Experimental module for Nissan electric vehicles using MyNISSAN in Europe. You must be able to sign in through the
      app. Tested with the Leaf ZE1; other models are unverified. NissanConnect EV is not supported. This uses an
      unofficial API; specific permission from Nissan has not been established, and access may change.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Username"
      aria-label="MyNISSAN username"
      autocomplete="username"
      required
      subtype="user"
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
      <template #help> The email address of your MyNISSAN account. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Password"
      aria-label="MyNISSAN password"
      autocomplete="current-password"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help>
        The password of your MyNISSAN account. Saving stores it in normal openWB settings, without encryption added by
        this module. Settings, backups and detailed logs may contain sensitive account data; keep them private.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Vehicle identification number (VIN)"
      aria-label="Vehicle identification number (VIN)"
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help>
        Required if the account contains multiple vehicles. Leave blank if the account contains only one vehicle.
      </template>
    </openwb-base-text-input>
    <openwb-base-alert subtype="info">
      Retrieves battery data stored by Nissan with its measurement timestamp. The vehicle is not actively woken up. Old
      values retain their original timestamp. Also retrieves the stored odometer when available. Configure query
      intervals and charge limits in openWB.
    </openwb-base-alert>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocNissanConnect",
  mixins: [VehicleConfigMixin],
};
</script>
