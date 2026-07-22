<template>
  <div class="flexible-tariff-naturstrom">
    <openwb-base-alert subtype="info">
      Über die Naturstrom-Authentifizierung kannst Du Deine Stromtarif-Daten für die Ladeplanung nutzen. Nach der Anmeldung
      bei Naturstrom wird eine Access- und Refresh-Token angezeigt, welche Du hier einfügen musst.
    </openwb-base-alert>
    <openwb-base-alert subtype="warning">
      Die Naturstrom-Authentifizierung kann nur über einen Computer oder die openWB-Cloud (remote.openwb.de) durchgeführt
      werden. Das Eintragen von Kunden- und Vertragsnummer ist nicht ausreichend, da nach der Anmeldung bei Naturstrom noch
      die Zustimmung erteilt werden muss.
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
      ref="tokenInput"
      title="Access-Token"
      required
      pattern="^ory_at_.*$"
      :model-value="flexibleTariff.configuration.token?.access_token || ''"
      @update:model-value="updateConfiguration($event, 'configuration.token.access_token')"
    >
      <template #help>
        Nachdem die Naturstrom-Authentifizierung abgeschlossen wurde, wird im geöffneten Browserfenster eine Access-Token
        angezeigt. Dieses kopieren und hier einfügen. Dieses wird benötigt, um auf Ihre Tarif-Daten zugreifen zu können.
      </template>
    </openwb-base-text-input>

    <openwb-base-text-input
      ref="tokenInput"
      title="Refresh-Token"
      required
      pattern="^ory_rt_.*$"
      :model-value="flexibleTariff.configuration.token?.refresh_token || ''"
      @update:model-value="updateConfiguration($event, 'configuration.token.refresh_token')"
    >
      <template #help>
        Nachdem die Naturstrom-Authentifizierung abgeschlossen wurde, wird im geöffneten Browserfenster eine Refresh-Token
        angezeigt. Dieses kopieren und hier einfügen. Dieses wird benötigt, um auf Ihre Tarif-Daten zugreifen zu können.
      </template>
    </openwb-base-text-input>

    <openwb-base-button-input
      title="3. Accounts abrufen"
      button-text="Accounts laden"
      subtype="info"
      :disabled="!flexibleTariff.configuration.token?.refresh_token"
      @button-clicked="fetch_accounts"
    >
      <template #help>
        Mit dem Refresh-Token wird automatisch die zugehörige Account-Information von Naturstrom abgerufen.
      </template>
    </openwb-base-button-input>

    <openwb-base-select-input
      title="Accounts"
      :options="accountsOptions"
      :model-value="flexibleTariff.configuration.account_id"
      @update:model-value="updateSelectedAccount"
    >
      <template #help>
        Wähle eine der verfügbaren Accounts aus. Diese wird für den Zugriff auf die Tarif-Daten benötigt.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import axios from "axios";
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffNaturstrom",
  mixins: [FlexibleTariffConfigMixin],
  data() {
    return {
      accounts: [],
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
          text: this.flexibleTariff.configuration.account_name || this.flexibleTariff.configuration.account_id,
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

    naturstrom_login_window() {
      // Open popup immediately to avoid popup blocker
      const naturstromLogin = window.open(
        "about:blank",
        "NaturstromLogin",
        "width=800,height=600,status=yes,scrollbars=yes,resizable=yes",
      );
      naturstromLogin.focus();

      // Then get the auth URL and redirect the popup
      this.createAuthUrl()
        .then((authResponse) => {
          naturstromLogin.location.href = authResponse.authorizationUrl;
        })
        .catch((error) => {
          naturstromLogin.close();
          console.error("Fehler beim Erstellen des Naturstrom-Links:", error);
          this.$root.postClientMessage(
            "Fehler beim Erstellen der NaturstromAuthentifizierung: " + (error.response?.data?.message || error.message),
            "danger",
          );
        });
    },

    async createAuthUrl() {
      // Call local server endpoint
      const response = await axios.post("https://naturstrom.openwb.de/naturstrom-auth.php", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        throw new Error("Server-Fehler beim Erstellen der Naturstrom-Authentifizierung");
      }
      return response.data;
    },

    async fetch_accounts() {
      if (!this.flexibleTariff.configuration.token?.refresh_token) {
        this.$root.postClientMessage("Bitte gib zuerst ein Refresh-Token ein.", "warning");
        return;
      }


      try {
        // Call the Naturstrom proxy endpoint to get accounts
        const response = await axios.get(
          `https://naturstrom.openwb.de/naturstrom-proxy.php/accounts`,
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${this.flexibleTariff.configuration.token?.access_token}`,
            },
          },
        );

        const accounts = Array.isArray(response.data?.data) ? response.data.data : [];
        const normalizedAccounts = accounts
          .filter((account) => account && account.id)
          .map((account) => ({
            id: account.id,
            name: account.name || account.reference || account.id,
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
          this.$root.postClientMessage("Keine Accounts für dieses Refresh-Token gefunden.", "warning");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Accounts:", error);
        this.$root.postClientMessage(
          "Fehler beim Abrufen der Accounts: " + (error.response?.data?.message || error.message),
          "danger",
        );
      }
    },
  },
};
</script>
