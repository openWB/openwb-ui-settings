<template>
  <div class="vehicle-soc-aiways">
    <openwb-base-alert subtype="info">
      Alle Werte müssen von der Aiways App abgefangen werden. Dazu kann diese
      <a href="https://community.home-assistant.io/t/read-aiways-u5-state-of-charge/466441/5"> Anleitung </a> verwendet
      werden.
    </openwb-base-alert>
    <openwb-base-text-input
      title="User ID"
      required
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
    </openwb-base-text-input>
    <openwb-base-text-input
      title="VIN"
      required
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Device ID"
      required
      :model-value="vehicle.configuration.device_id"
      @update:model-value="updateConfiguration($event, 'configuration.device_id')"
    >
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Register ID"
      required
      :model-value="vehicle.configuration.register_id"
      @update:model-value="updateConfiguration($event, 'configuration.register_id')"
    >
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Token"
      required
      :model-value="vehicle.configuration.token"
      @update:model-value="updateConfiguration($event, 'configuration.token')"
    >
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Condition URL"
      subtype="url"
      required
      :model-value="vehicle.configuration.condition_url"
      @update:model-value="updateConfiguration($event, 'configuration.condition_url')"
    >
    </openwb-base-text-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocAiways",
  mixins: [VehicleConfigMixin],
};
</script>
