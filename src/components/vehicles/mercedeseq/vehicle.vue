<template>
  <div class="vehicle-soc-mercedeseq">
    <openwb-base-text-input
      title="Client-ID"
      required
      subtype="user"
      :model-value="vehicle.configuration.client_id"
      @update:model-value="updateConfiguration($event, 'configuration.client_id')"
    >
      <template #help> Die im Developer Portal angelegte Client-ID. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Client Secret"
      required
      subtype="password"
      :model-value="vehicle.configuration.client_secret"
      @update:model-value="updateConfiguration($event, 'configuration.client_secret')"
    >
      <template #help> Das im Developer Portal angelegte Client Secret. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="VIN"
      required
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help> Die Fahrgestellnummer des Fahrzeugs. </template>
    </openwb-base-text-input>
    <openwb-base-alert subtype="info">
      Vor dem Anmelden bitte die Angaben speichern.<br />
      Die Callback-URL für die Anmeldung lautet:<br />
      <openwb-base-copy-to-clipboard
        class="text-info"
        tooltip="URL kopieren"
      >
        {{ callback_url }}
      </openwb-base-copy-to-clipboard>
    </openwb-base-alert>
    <openwb-base-button-input
      title="Anmelden"
      button-text="Bei Mercedes Anmelden"
      subtype="success"
      :disabled="!input_complete"
      @button-clicked="login_window"
    >
      <template #help>
        Es wird ein neues Browserfenster geöffnet, in dem Sie sich bei Mercedes mit Ihren Zugangsdaten anmelden
        können.<br />
      </template>
    </openwb-base-button-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocMercedesEq",
  mixins: [VehicleConfigMixin],
  computed: {
    callback_url() {
      return `${location.origin}/openWB/web/settings/modules/vehicles/mercedeseq/callback_vehicle.php`;
    },
    login_url() {
      return (
        "https://ssoalpha.dvb.corpinter.net/v1/auth?response_type=code" +
        `&state=${this.vehicleId}&client_id=${this.vehicle.configuration.client_id}&redirect_uri=${this.callback_url}` +
        "&scope=mb:vehicle:mbdata:evstatus%20offline_access%20openid"
      );
    },
    input_complete() {
      return (
        this.vehicle.configuration.client_id &&
        this.vehicle.configuration.client_secret &&
        this.vehicle.configuration.vin
      );
    },
  },
  methods: {
    // mercedes specific methods
    login_window() {
      console.debug("callback url", this.callback_url);
      console.debug("login url", this.login_url);
      var mercedesLogin = window.open(
        this.login_url,
        "MercedesLogin",
        "width=800,height=600,status=yes,scrollbars=yes,resizable=yes",
      );
      mercedesLogin.focus();
    },
  },
};
</script>
