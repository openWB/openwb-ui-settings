<template>
  <div class="flexible-tariff-rabot">
    <openwb-base-alert subtype="info">
      Über die Rabot-Authentifizierung können Sie Ihre Stromtarif-Daten für das Lastmanagement nutzen.
      Nach der Anmeldung bei Rabot wird eine Kundennummer in der Adresszeile angezeigt, die Sie hier einfügen müssen.
    </openwb-base-alert>

    <openwb-base-button-input
      title="1. Bei Rabot anmelden"
      button-text="Bei Rabot Anmelden"
      subtype="success"
      @button-clicked="rabot_login_window"
    >
      <template #help>
        Es wird ein neues Browserfenster geöffnet, in dem Sie sich bei Rabot mit Ihren Zugangsdaten anmelden können.
        Nach der erfolgreichen Anmeldung wird eine Kundennummer in der Adresszeile des Browsers angezeigt.
      </template>
    </openwb-base-button-input>

    <openwb-base-text-input
      v-model="redirect_url"
      title="2. URL aus Adresszeile kopieren und einfügen"
      subtype="url"
    >
      <template #help>
        Hier die komplette URL (Text in der Adresszeile) aus dem geöffneten Browserfenster einfügen, 
        nachdem die Rabot-Authentifizierung abgeschlossen wurde und eine Kundennummer angezeigt wird.
      </template>
    </openwb-base-text-input>

    <openwb-base-button-input
      title="3. Kundennummer extrahieren"
      button-text="Kundennummer übernehmen"
      subtype="success"
      :disabled="!redirect_url || redirect_url.trim() === ''"
      @button-clicked="extract_customer_number"
    >
      <template #help>
        Die in der eingegebenen URL enthaltene Kundennummer wird extrahiert und automatisch in das folgende Feld eingetragen.
      </template>
    </openwb-base-button-input>

    <hr />

    <openwb-base-text-input
      title="Kundennummer"
      required
      :model-value="flexibleTariff.configuration.customer_number"
      @update:model-value="updateConfiguration($event, 'configuration.customer_number')"
    >
      <template #help>
        Die Kundennummer, die Sie bei der Rabot-Authentifizierung erhalten haben.
        Diese wird benötigt, um auf Ihre Tarif-Daten zugreifen zu können.
      </template>
    </openwb-base-text-input>

    <openwb-base-button-input
      title="4. Vertragsnummer abrufen"
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
        Wählen Sie eine der verfügbaren Vertragsnummern aus.
        Diese wird für den Zugriff auf die Tarif-Daten benötigt.
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
      redirect_url: '',
      contractNumbers: [],
    };
  },
  computed: {
    contractOptions() {
      return this.contractNumbers.map(contract => ({
        value: contract,
        text: contract
      }));
    }
  },
  methods: {
    async rabot_login_window() {
      try {
        // Call local server endpoint to create Rabot auth URL
        const authResponse = await this.createAuthUrl();
        
        // Open the authorization URL in a new window
        const rabotLogin = window.open(
          authResponse.authorizationUrl,
          "RabotLogin",
          "width=800,height=600,status=yes,scrollbars=yes,resizable=yes",
        );
        
        rabotLogin.focus();
        
      } catch (error) {
        console.error("Fehler beim Erstellen des Rabot-Links:", error);
        this.$root.postClientMessage(
          "Fehler beim Erstellen der Rabot-Authentifizierung: " + (error.response?.data?.message || error.message),
          "danger"
        );
      }
    },

    async createAuthUrl() {
      
      const requestData = { "externalCustomerId": null, "state": null };

      // Call local server endpoint
      const response = await axios.post(
        "https://rabot.openwb.de/rabot-auth.php",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error("Server-Fehler beim Erstellen der Rabot-Authentifizierung");
      }

      return response.data;
    },
    
    extract_customer_number() {
      if (!this.redirect_url || this.redirect_url.trim() === '') {
        this.$root.postClientMessage("Bitte geben Sie zuerst die URL ein.", "warning");
        return;
      }
      
      try {
        // Extract customer number from URL parameters
        const url = new URL(this.redirect_url);
        const customerNumber = url.searchParams.get('customerNumber');
        
        if (customerNumber) {
          this.updateConfiguration(customerNumber, 'configuration.customer_number');
          this.$root.postClientMessage(
            "Kundennummer erfolgreich übernommen: " + customerNumber,
            "success"
          );
          // Clear the URL input field
          this.redirect_url = '';
        } else {
          this.$root.postClientMessage(
            "Keine Kundennummer in der URL gefunden. Bitte überprüfen Sie die eingegebene URL.",
            "danger"
          );
        }
      } catch (error) {
        console.error("Fehler beim Extrahieren der Kundennummer:", error);
        this.$root.postClientMessage(
          "Die eingegebene URL ist ungültig. Bitte überprüfen Sie die URL.",
          "danger"
        );
      }
    },

    async fetch_contract_number() {
      if (!this.flexibleTariff.configuration.customer_number) {
        this.$root.postClientMessage("Bitte geben Sie zuerst eine Kundennummer ein.", "warning");
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
          }
        );

        if (response.data && response.data.contractNumbers && response.data.contractNumbers.length > 0) {
          const contractNumbers = response.data.contractNumbers;
          
          // Speichere alle Vertragsnummern für die Auswahlliste
          this.contractNumbers = contractNumbers;
          
          // Wenn mehrere Verträge vorhanden sind, den ersten verwenden
          const contractNumber = contractNumbers[0];
          this.updateConfiguration(contractNumber, 'configuration.contract_number');
          
          if (contractNumbers.length > 1) {
            this.$root.postClientMessage(
              `${contractNumbers.length} Verträge gefunden. Erster Vertrag ausgewählt: ${contractNumber}. Sie können einen anderen Vertrag aus der Liste wählen.`,
              "success"
            );
          } else {
            this.$root.postClientMessage(
              "Vertragsnummer erfolgreich abgerufen: " + contractNumber,
              "success"
            );
          }
        } else {
          this.$root.postClientMessage(
            "Keine Verträge für diese Kundennummer gefunden.",
            "warning"
          );
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Vertragsnummer:", error);
        this.$root.postClientMessage(
          "Fehler beim Abrufen der Vertragsnummer: " + (error.response?.data?.message || error.message),
          "danger"
        );
      }
    }
  }
};
</script>
