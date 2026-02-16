<template>
  <div class="vehicle-soc-tesla">
    <openwb-base-number-input
      title="Fahrzeug-ID"
      required
      :min="0"
      :model-value="vehicle.configuration.tesla_ev_num"
      @update:model-value="updateConfiguration($event, 'configuration.tesla_ev_num')"
    >
      <template #help> Die ID des Fahrzeugs bei Tesla. Normalerweise "0" bei nur einem Fahrzeug im Konto. </template>
    </openwb-base-number-input>
    <openwb-base-heading>Token abrufen oder eingeben</openwb-base-heading>
    <openwb-base-button-input
      title="1. Anmelden"
      button-text="Bei Tesla Anmelden"
      subtype="success"
      @button-clicked="tesla_login_window"
    >
      <template #help>
        Es wird ein neues Browserfenster geöffnet, in dem Du dich bei Tesla mit Deinen Zugangsdaten anmelden kannst.
      </template>
    </openwb-base-button-input>
    <openwb-base-text-input
      v-model="page_not_found_url"
      title="2. URL kopieren und einfügen"
      subtype="url"
      :empty-value="null"
    >
      <template #help>
        Hier die komplette URL (Text in der Adresszeile) aus dem geöffneten Browserfenster einfügen, wenn dort "Page Not
        Found" angezeigt wird.
      </template>
    </openwb-base-text-input>
    <openwb-base-button-input
      title="3. Token abrufen"
      button-text="Jetzt abrufen"
      subtype="success"
      :disabled="page_not_found_url === null"
      @button-clicked="tesla_login"
    >
      <template #help>
        Der in der eingegebenen URL enthaltene Code wird genutzt, um ein Anmeldetoken bei Tesla abzurufen. Ist dies
        erfolgreich, so werden die Daten des Token in den weiteren Feldern automatisch eingegeben.
      </template>
    </openwb-base-button-input>
    <hr />
    <openwb-base-text-input
      title="Access Token"
      pattern="^(ey).*"
      required
      :model-value="vehicle.configuration.token ? vehicle.configuration.token.access_token : ''"
      @update:model-value="updateConfiguration($event, 'configuration.token.access_token')"
    />
    <openwb-base-text-input
      title="Refresh Token"
      pattern="^(ey).*"
      required
      :model-value="vehicle.configuration.token ? vehicle.configuration.token.refresh_token : ''"
      @update:model-value="updateConfiguration($event, 'configuration.token.refresh_token')"
    />
    <openwb-base-number-input
      title="Erstellt um"
      required
      :model-value="vehicle.configuration.token ? vehicle.configuration.token.created_at : 0"
      @update:model-value="updateConfiguration($event, 'configuration.token.created_at')"
    >
      <template #help> Unix Timestamp des Zeitpunktes, an dem das Token erzeugt wurde. </template>
    </openwb-base-number-input>
    <openwb-base-number-input
      title="Ungültig in"
      unit="s"
      required
      :model-value="vehicle.configuration.token ? vehicle.configuration.token.expires_in : 0"
      @update:model-value="updateConfiguration($event, 'configuration.token.expires_in')"
    >
      <template #help> Zeitspanne in Sekunden, nach der das Token ungültig wird. </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
/**
 * Credits to:
 * https://raw.githubusercontent.com/teslascope/tokens/master/auth.tokens.py
 * https://github.com/timdorr/tesla-api/discussions/288
 * https://github.com/timdorr/tesla-api/discussions/296
 * https://github.com/timdorr/tesla-api/discussions/362
 */
import { encode } from "urlsafe-base64";
import crypto from "crypto";
import url from "url";
import axios from "axios";
// import { Buffer } from "buffer";

import ComponentStateVue from "../../mixins/ComponentState.vue";
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocTesla",
  mixins: [ComponentStateVue, VehicleConfigMixin],
  data() {
    return {
      tesla_api_oauth2: "https://auth.tesla.com/oauth2/v3",
      tesla_api_redirect: "https://auth.tesla.com/void/callback",
      tesla_api_owners: "https://owner-api.teslamotors.com/oauth/token",
      user_agent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) " +
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      code_challenge: null,
      code_verifier: null,
      page_not_found_url: null,
    };
  },
  methods: {
    // tesla specific methods
    tesla_login_window() {
      this.tesla_gen_challenge();
      var teslaLogin = window.open(
        this.tesla_gen_url(),
        "TeslaLogin",
        "width=800,height=600,status=yes,scrollbars=yes,resizable=yes",
      );
      teslaLogin.focus();
    },
    tesla_gen_challenge() {
      this.code_verifier = encode(crypto.randomBytes(86))
        .replace(/[^a-zA-Z0-9]/gi, "")
        .substring(0, 86);
      const hash = crypto.createHash("sha256").update(this.code_verifier).digest();
      this.code_challenge = encode(hash);
      console.debug(this.code_verifier, this.code_verifier.length, this.code_challenge, this.code_challenge.length);
    },
    tesla_gen_url() {
      const teslaAuthUrl = new URL(this.tesla_api_oauth2 + "/authorize/");
      teslaAuthUrl.searchParams.append("client_id", "ownerapi");
      teslaAuthUrl.searchParams.append("code_challenge", this.code_challenge);
      teslaAuthUrl.searchParams.append("code_challenge_method", "S256");
      teslaAuthUrl.searchParams.append("redirect_uri", this.tesla_api_redirect);
      teslaAuthUrl.searchParams.append("response_type", "code");
      teslaAuthUrl.searchParams.append("scope", "openid email offline_access");
      teslaAuthUrl.searchParams.append("state", "myteslaapp");
      return teslaAuthUrl;
    },
    async tesla_login() {
      const queryObject = url.parse(this.page_not_found_url, true).query;
      console.debug("queryObject", queryObject);
      if (!queryObject.code) {
        console.error("Something is wrong... Code does not exist in URL");
        this.$root.postClientMessage("Die eingegebene URL ist ungültig.", "danger");
        return;
      }
      const data = {
        url: this.tesla_api_owners,
        user_agent: this.user_agent,
        data: {
          grant_type: "authorization_code",
          client_id: "ownerapi",
          code: queryObject.code,
          code_verifier: this.code_verifier,
          redirect_uri: this.tesla_api_redirect,
        },
      };
      try {
        const response = await axios.post(
          location.protocol + "//" + location.host + "/openWB/web/settings/modules/vehicles/tesla/tesla.php",
          JSON.parse(JSON.stringify(data)),
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );
        console.debug("response", response);
        this.updateConfiguration(
          {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            created_at: response.data.created_at,
            expires_in: response.data.expires_in,
          },
          "configuration.token",
        );
        this.$root.postClientMessage("Token erfolgreich abgerufen.", "success");
      } catch (error) {
        console.error(error);
        this.$root.postClientMessage(
          "Beim Abruf der Token ist ein Fehler aufgetreten!<pre>" + error + "</pre>",
          "danger",
        );
      }
    },
  },
};
</script>
