<template>
  <div class="flexible-tariff-rabot">
    <openwb-base-alert subtype="info">
      Über die Rabot-Authentifizierung kannst Du Deine Stromtarif-Daten für die Ladeplanung nutzen. Nach der Anmeldung
      bei Rabot wird eine Kundennummer in der Adresszeile angezeigt, die Du hier einfügen musst.
    </openwb-base-alert>
    <openwb-base-alert subtype="warning">
      Die Rabot-Authentifizierung kann nur über einen Computer oder die openWB-Cloud (remote.openwb.de) durchgeführt
      werden. Das Eintragen von Kunden- und Vertragsnummer ist nicht ausreichend, da nach der Anmeldung bei Rabot noch
      die Zustimmung erteilt werden muss.
    </openwb-base-alert>

    <openwb-base-button-input
      title="1. Bei Rabot anmelden"
      button-text="Bei Rabot Anmelden"
      subtype="success"
      @button-clicked="() => rabot_login_window()"
    >
      <template #help>
        Es wird ein neues Browserfenster geöffnet, in dem Du Dich bei Rabot mit Deinen Zugangsdaten anmelden kannst.
      </template>
    </openwb-base-button-input>

    <openwb-base-text-input
      title="2. Kundennummer kopieren und einfügen"
      required
      :model-value="flexibleTariff.configuration.customer_number"
      @update:model-value="updateConfiguration($event, 'configuration.customer_number')"
    >
      <template #help>
        Nachdem die Rabot-Authentifizierung abgeschlossen wurde, wird im geöffneten Browserfenster eine Kundennummer
        angezeigt. Diese kopieren und hier einfügen. Diese wird benötigt, um auf Ihre Tarif-Daten zugreifen zu können.
      </template>
    </openwb-base-text-input>

    <openwb-base-button-input
      title="3. Vertragsnummer abrufen"
      button-text="Vertrag laden"
      subtype="info"
      :disabled="!flexibleTariff.configuration.customer_number"
      @button-clicked="fetch_contract_number"
    >
      <template #help>
        Mit der Kundennummer wird automatisch die zugehörige Vertragsnummer von Rabot abgerufen.
      </template>
    </openwb-base-button-input>

    <openwb-base-select-input
      title="Vertragsnummer"
      :options="contractOptions"
      :model-value="flexibleTariff.configuration.contract_number"
      @update:model-value="updateConfiguration($event, 'configuration.contract_number')"
    >
      <template #help>
        Wähle eine der verfügbaren Vertragsnummern aus. Diese wird für den Zugriff auf die Tarif-Daten benötigt.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import axios from "axios";
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffRabot",
  mixins: [FlexibleTariffConfigMixin],
  data() {
    return {
      contractNumbers: [],
    };
  },
  computed: {
    contractOptions() {
      const options = this.contractNumbers.map((contract) => ({
        value: contract,
        text: contract,
      }));

      // Fallback: Wenn keine Options vorhanden sind, aber eine Vertragsnummer in der Config existiert
      if (options.length === 0 && this.flexibleTariff.configuration.contract_number) {
        options.push({
          value: this.flexibleTariff.configuration.contract_number,
          text: this.flexibleTariff.configuration.contract_number,
        });
      }

      return options;
    },
  },
  methods: {
    rabot_login_window() {
      // Open popup immediately to avoid popup blocker
      const rabotLogin = window.open(
        "about:blank",
        "RabotLogin",
        "width=800,height=600,status=yes,scrollbars=yes,resizable=yes",
      );
      rabotLogin.focus();

      // Then get the auth URL and redirect the popup
      this.createAuthUrl()
        .then((authResponse) => {
          rabotLogin.location.href = authResponse.authorizationUrl;
        })
        .catch((error) => {
          rabotLogin.close();
          console.error("Fehler beim Erstellen des Rabot-Links:", error);
          this.$root.postClientMessage(
            "Fehler beim Erstellen der Rabot-Authentifizierung: " + (error.response?.data?.message || error.message),
            "danger",
          );
        });
    },

    async createAuthUrl() {
      // Call local server endpoint
      const response = await axios.post("https://rabot.openwb.de/rabot-auth.php", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        throw new Error("Server-Fehler beim Erstellen der Rabot-Authentifizierung");
      }
      return response.data;
    },

    async fetch_contract_number() {
      if (!this.flexibleTariff.configuration.customer_number) {
        this.$root.postClientMessage("Bitte gib zuerst eine Kundennummer ein.", "warning");
        return;
      }

      try {
        // Call the Rabot proxy endpoint to get contracts
        const response = await axios.get(
          `https://rabot.openwb.de/rabot-proxy.php/customers/${this.flexibleTariff.configuration.customer_number}/contracts`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.data && response.data.contractNumbers && response.data.contractNumbers.length > 0) {
          const contractNumbers = response.data.contractNumbers;

          // Speichere alle Vertragsnummern für die Auswahlliste
          this.contractNumbers = contractNumbers;

          // Wenn mehrere Verträge vorhanden sind, den ersten verwenden
          const contractNumber = contractNumbers[0];
          this.updateConfiguration(contractNumber, "configuration.contract_number");

          if (contractNumbers.length > 1) {
            this.$root.postClientMessage(
              `${contractNumbers.length} Verträge gefunden. Erster Vertrag ausgewählt: ${contractNumber}. Du kannst einen anderen Vertrag aus der Liste wählen.`,
              "success",
            );
          } else {
            this.$root.postClientMessage("Vertragsnummer erfolgreich abgerufen: " + contractNumber, "success");
          }
        } else {
          this.$root.postClientMessage("Keine Verträge für diese Kundennummer gefunden.", "warning");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Vertragsnummer:", error);
        this.$root.postClientMessage(
          "Fehler beim Abrufen der Vertragsnummer: " + (error.response?.data?.message || error.message),
          "danger",
        );
      }
    },
  },
};
</script>
