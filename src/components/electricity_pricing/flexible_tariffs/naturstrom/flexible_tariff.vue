<template>
  <div class="flexible-tariff-naturstrom">
    <openwb-base-alert subtype="info">
      Über die Naturstrom-Authentifizierung kannst Du Deine Stromtarif-Daten für die Ladeplanung nutzen. Nach der Anmeldung
      bei Naturstrom wird ein Access- und Refresh-Token angezeigt, welche Du hier einfügen musst.
    </openwb-base-alert>

    <openwb-base-button-input
      title="1. Bei Naturstrom anmelden"
      button-text="Bei Naturstrom Anmelden"
      subtype="success"
      @button-clicked="() => naturstrom_login_window()"
    >
      <template #help>
        Es wird ein neues Browserfenster geöffnet, in dem Du Dich bei Naturstrom mit Deinen Zugangsdaten anmelden kannst.
      </template>
    </openwb-base-button-input>

    <openwb-base-text-input
      ref="oauthCallbackUrlInput"
      title="2. Callback-URL nach Login"
      :model-value="oauthCallbackUrl"
      @update:model-value="oauthCallbackUrl = $event"
    >
      <template #help>
        Kopiere die komplette URL aus dem Login-Popup nach erfolgreicher Anmeldung und füge sie hier ein.
      </template>
    </openwb-base-text-input>

    <openwb-base-button-input
      title="3. Callback-URL prüfen und Token holen"
      button-text="URL verarbeiten"
      subtype="success"
      @button-clicked="processOAuthCallbackUrl"
    >
      <template #help>
        Die URL wird lokal geparst, der State gegen den gespeicherten OAuth-State geprüft und anschließend per PKCE
        Access- und Refresh-Token abgefragt.
      </template>
    </openwb-base-button-input>

    <openwb-base-text-input
      ref="accesstokenInput"
      title="Access-Token"
      required
      pattern="^ory_at_.*$"
      :model-value="flexibleTariff.configuration.token?.access_token || ''"
      @update:model-value="updateConfiguration($event, 'configuration.token.access_token')"
    >
      <template #help>
        Das Access-Token wird bei erfolgreicher URL-Verarbeitung automatisch gesetzt und kann hier bei Bedarf manuell
        eingetragen werden.
      </template>
    </openwb-base-text-input>

    <openwb-base-text-input
      ref="refreshtokenInput"
      title="Refresh-Token"
      required
      pattern="^ory_rt_.*$"
      :model-value="flexibleTariff.configuration.token?.refresh_token || ''"
      @update:model-value="updateConfiguration($event, 'configuration.token.refresh_token')"
    >
      <template #help>
        Nachdem die Naturstrom-Authentifizierung abgeschlossen wurde, wird im geöffneten Browserfenster ein Refresh-Token
        angezeigt. Dieses kopieren und hier einfügen. Dieses wird benötigt, um auf Deine Tarif-Daten zugreifen zu können.
      </template>
    </openwb-base-text-input>

    <openwb-base-button-input
      title="4. Accounts abrufen"
      button-text="Accounts laden"
      subtype="info"
      :disabled="!flexibleTariff.configuration.token?.access_token"
      @button-clicked="fetch_accounts"
    >
      <template #help>
        Mit dem Access-Token wird automatisch die zugehörige Account-Information von Naturstrom abgerufen.
      </template>
    </openwb-base-button-input>

    <openwb-base-select-input
      title="Accounts"
      :options="accountsOptions"
      :model-value="flexibleTariff.configuration.account_id"
      @update:model-value="updateSelectedAccount"
    >
      <template #help>
        Wähle einen der verfügbaren Accounts aus. Dieser wird für den Zugriff auf die Tarif-Daten benötigt.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import axios from "axios";
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";
import { ref } from "vue";

const loading = ref(false);

const OAUTH_BASE_URL = "https://naturstrom-staging.powerquartier.de";
const CLIENT_ID = "exnaton-public";
const REDIRECT_URI = "https://naturstrom.openwb.de/naturstrom-callback.php";
const SCOPE = "email profile";
const OAUTH_MAX_AGE_MS = 10 * 60 * 1000;
const LOCAL_NATURSTROM_ENDPOINT = `${location.protocol}//${location.host}/openWB/web/settings/modules/electricity_pricing/flexible_tariffs/naturstrom/naturstrom.php`;


export default {
  name: "FlexibleTariffNaturstrom",
  mixins: [FlexibleTariffConfigMixin],
  data() {
    return {
      accounts: [],
      oauthCallbackUrl: "",
    };
  },
  computed: {
    accountsOptions() {
      const options = this.accounts.map((account) => ({
        value: account.id,
        text: account.name,
      }));

      // Fallback: Wenn keine Optionen vorhanden sind, aber eine Account-ID in der Config existiert
      if (options.length === 0 && this.flexibleTariff.configuration.account_id) {
        options.push({
          value: this.flexibleTariff.configuration.account_id,
          text: this.flexibleTariff.configuration.account_name ||  this.flexibleTariff.configuration.account_id,
        });
      }

      return options;
    },
  },
  methods: {
    updateSelectedAccount(accountId) {
      this.updateConfiguration(accountId, "configuration.account_id");

      const selectedAccount = this.accounts.find((account) => account.id === accountId);
      if (selectedAccount?.name) {
        this.updateConfiguration(selectedAccount.name, "configuration.account_name");
      }
    },

    clearOAuthSession() {
      sessionStorage.removeItem("oauth_state");
      sessionStorage.removeItem("pkce_code_verifier");
      sessionStorage.removeItem("oauth_started_at");
    },

    async naturstrom_login_window() {
      // Open popup immediately to avoid popup blocker
      const naturstromLogin = window.open(
        "about:blank",
        "NaturstromLogin",
        "width=800,height=600,status=yes,scrollbars=yes,resizable=yes",
      );
      if (!naturstromLogin) {
         this.$root.postClientMessage(
           "Popup konnte nicht geöffnet werden. Bitte erlaube Popups für diese Seite.",
           "danger",
         );
         return;
       }
      naturstromLogin.focus();

      // Build OAuth URL locally and redirect the popup
      try {
        const authUrl = await this.startOAuth();
        naturstromLogin.location.href = authUrl;
      } catch (error) {
        naturstromLogin.close();
        console.error("Fehler beim Erstellen des Naturstrom-Links:", error);
        this.$root.postClientMessage(
          "Fehler beim Erstellen der Naturstrom-Authentifizierung: " + (error.response?.data?.message || error.message),
          "danger",
        );
      }
    },

    async fetch_accounts() {
      if (!this.flexibleTariff.configuration.token?.access_token) {
         this.$root.postClientMessage("Kein Access-Token vorhanden.", "warning");
        return;
      }


      try {
        const requestPayload = {
          action: "accounts",
          url: OAUTH_BASE_URL,
          user_agent: navigator.userAgent,
          data: {
            access_token: this.flexibleTariff.configuration.token?.access_token,
          },
        };

        // Call the local Naturstrom PHP endpoint to get accounts
        const response = await axios.post(
          LOCAL_NATURSTROM_ENDPOINT,
          JSON.parse(JSON.stringify(requestPayload)),
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          },
        );

        const rawData = response?.data;
        const parsedData = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
        const accounts = parsedData?.data ?? [];
        const normalizedAccounts = accounts
          .filter((account) => account && account.id)
          .map((account) => ({
            id: account.id,
            name: account.name,
          }));

        if (normalizedAccounts.length > 0) {
          // Speichere alle Accounts für die Auswahlliste
          this.accounts = normalizedAccounts;

          // Wenn mehrere Accounts vorhanden sind, den ersten verwenden
          const firstAccount = normalizedAccounts[0];
          this.updateConfiguration(firstAccount.id, "configuration.account_id");
          this.updateConfiguration(firstAccount.name, "configuration.account_name");

          if (normalizedAccounts.length > 1) {
            this.$root.postClientMessage(
              `${normalizedAccounts.length} Accounts gefunden. Erster Account ausgewählt: ${firstAccount.name}. Du kannst einen anderen Account aus der Liste wählen.`,
              "success",
            );
          } else {
            this.$root.postClientMessage("Account erfolgreich abgerufen: " + firstAccount.name, "success");
          }
        } else {
          const responsePreview = typeof parsedData === "object" ? JSON.stringify(parsedData).slice(0, 300) : String(parsedData);
          this.$root.postClientMessage(
            "Keine Accounts in der Antwort gefunden. Antwort (gekürzt): " + responsePreview,
            "warning",
          );
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Accounts:", error);
        this.$root.postClientMessage(
          "Fehler beim Abrufen der Accounts: " + (error.response?.data?.message || error.message),
          "danger",
        );
      }
    },

    async processOAuthCallbackUrl() {
      try {
        if (!this.oauthCallbackUrl) {
          this.$root.postClientMessage("Bitte füge zuerst die Callback-URL ein.", "warning");
          return;
        }

        const callbackUrl = new URL(this.oauthCallbackUrl);
        const code = callbackUrl.searchParams.get("code");
        const returnedState = callbackUrl.searchParams.get("state");

        if (!code || !returnedState) {
          this.$root.postClientMessage("Die URL enthält keinen gültigen Code oder State.", "danger");
          return;
        }

        const expectedState = sessionStorage.getItem("oauth_state");
        const codeVerifier = sessionStorage.getItem("pkce_code_verifier");
        const startedAt = Number(sessionStorage.getItem("oauth_started_at"));

        if (!expectedState || !codeVerifier) {
          this.$root.postClientMessage("OAuth-Session fehlt. Bitte den Login erneut starten.", "danger");
          return;
        }

        if (returnedState !== expectedState) {
          this.$root.postClientMessage("State stimmt nicht mit der gestarteten OAuth-Session überein.", "danger");
          return;
        } else {
          console.log("State validiert:", returnedState);
        }

        if (Number.isFinite(startedAt) && startedAt > 0) {
          const ageMs = Date.now() - startedAt;
          if (ageMs > OAUTH_MAX_AGE_MS) {
            this.clearOAuthSession();
            this.$root.postClientMessage("OAuth-Session ist abgelaufen. Bitte neu anmelden.", "warning");
            return;
          }
        }

        const requestPayload = {
          action: "token",
          url: OAUTH_BASE_URL,
          user_agent: navigator.userAgent,
          data: {
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            code_verifier: codeVerifier,
          },
        };

        const tokenResponse = await axios.post(
          LOCAL_NATURSTROM_ENDPOINT,
          JSON.parse(JSON.stringify(requestPayload)),
          {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          },
        );

        console.log("Token-Antwort:", tokenResponse);

        const rawTokenData = tokenResponse?.data;
        const parsedTokenData = typeof rawTokenData === "string" ? JSON.parse(rawTokenData) : rawTokenData;
        const tokenData = parsedTokenData?.data && typeof parsedTokenData.data === "object"
          ? parsedTokenData.data
          : parsedTokenData;

        const accessToken = tokenData?.access_token;
        const refreshToken = tokenData?.refresh_token;

        if (!accessToken) {
          throw new Error("Token-Antwort enthält kein Access-Token. Response: " + JSON.stringify(parsedTokenData));
        }

        this.updateConfiguration(accessToken, "configuration.token.access_token");
        if (refreshToken) {
          this.updateConfiguration(refreshToken, "configuration.token.refresh_token");
        }

        this.clearOAuthSession();
        this.oauthCallbackUrl = "";
        if (refreshToken) {
          this.$root.postClientMessage("OAuth erfolgreich abgeschlossen. Access- und Refresh-Token wurden gesetzt.", "success");
        } else {
          this.$root.postClientMessage("OAuth erfolgreich abgeschlossen. Access-Token wurde gesetzt (kein Refresh-Token in der Antwort).", "warning");
        }
      } catch (error) {
        console.error("Fehler beim Verarbeiten der Callback-URL:", error);
        this.$root.postClientMessage(
          "Fehler beim Verarbeiten der Callback-URL: " + (error.response?.data?.error_description || error.message),
          "danger",
        );
      }
    },

    toBase64Url(bytes) {
      return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    },

    randomString(length = 64) {
      const bytes = new Uint8Array(length);
      crypto.getRandomValues(bytes);
      return this.toBase64Url(bytes).slice(0, length);
    },

    async sha256(input) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      // In manchen Dev-Setups ist crypto.subtle nicht verfügbar (z. B. non-HTTPS context).
      if (globalThis.crypto?.subtle?.digest) {
        const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
        return new Uint8Array(hashBuffer);
      }

      const { createHash } = await import("crypto");
      const hash = createHash("sha256").update(Buffer.from(data)).digest();
      return new Uint8Array(hash);
    },

    async startOAuth() {
      loading.value = true;
      try {
        const state = this.randomString(64);
        const codeVerifier = this.randomString(96);
        const codeChallenge = this.toBase64Url(await this.sha256(codeVerifier));

        sessionStorage.setItem("oauth_state", state);
        sessionStorage.setItem("pkce_code_verifier", codeVerifier);
        sessionStorage.setItem("oauth_started_at", String(Date.now()));

        const params = new URLSearchParams({
          client_id: CLIENT_ID,
          response_type: "code",
          scope: SCOPE,
          redirect_uri: REDIRECT_URI,
          state,
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
        });

        const authUrl = `${OAUTH_BASE_URL}/api/public-auth/oauth2/auth?${params.toString()}`;
        return authUrl;
      } catch (err) {
        console.error("OAuth Start fehlgeschlagen:", err);
        throw err;
      } finally {
        loading.value = false;
      }
    },
  },
};
</script>