<template>
  <div class="flexible-tariff-tibber">
    <openwb-base-alert subtype="info">
      Deinen persönlichen Tibber-Token erhältst Du über die
      <a
        href="https://developer.tibber.com/explorer"
        target="_blank"
        rel="noopener noreferrer"
      >
        Tibber-Developer-Seite
      </a>
      . Behandle Deinen Token wie ein Passwort, da sich darüber auch persönliche Daten aus Deinem Tibber-Account
      abfragen lassen! Die Home-ID kannst Du (wenn bekannt) in das Eingabefeld selbst eintragen oder nach Eingabe Deines
      Token durch Klick auf den Button von der openWB ermitteln lassen. Unerlaubte Zeichen werden aus dem Token und der
      Home-ID automatisch gelöscht.
    </openwb-base-alert>
    <openwb-base-text-input
      ref="tokenInput"
      title="Token"
      required
      :model-value="flexibleTariff.configuration.token"
      @update:model-value="updateConfiguration($event, 'configuration.token')"
    />
    <openwb-base-button-input
      title="Home-IDs abrufen"
      button-text="Jetzt abrufen"
      subtype="success"
      :disabled="!flexibleTariff.configuration.token?.length"
      @button-clicked="getTibberHomeList"
    />
    <openwb-base-select-input
      title="Verfügbare Home-IDs"
      :options="tibberHomeList"
      :model-value="flexibleTariff.configuration.home_id"
      @update:model-value="updateConfiguration($event, 'configuration.home_id')"
    />
    <openwb-base-text-input
      title="Home-ID"
      required
      :model-value="flexibleTariff.configuration.home_id"
      @update:model-value="updateConfiguration($event, 'configuration.home_id')"
    />
  </div>
</template>

<script>
import FlexibleTariffConfigMixin from "../FlexibleTariffConfigMixin.vue";

export default {
  name: "FlexibleTariffTibber",
  mixins: [FlexibleTariffConfigMixin],
  data() {
    return {
      tibberAPI: "https://api.tibber.com/v1-beta/gql",
      tibberHomeList: [],
    };
  },
  methods: {
    async getTibberHomeList() {
      if (this.flexibleTariff.configuration.token === null) {
        return;
      }
      const homeQuery =
        '{ "query": "{viewer {homes{id address{address1 address2 address3 postalCode city country}}}}" }';
      try {
        const response = await this.axios.post(this.tibberAPI, homeQuery, {
          headers: {
            Authorization: "Bearer " + this.flexibleTariff.configuration.token,
            "Content-Type": "application/json",
          },
        });
        this.tibberHomeList = response.data.data.viewer.homes.map((home) => {
          let text = home.address.address1;
          if (home.address.address2) {
            text = text + ", " + home.address.address2;
          }
          if (home.address.address3) {
            text = text + ", " + home.address.address3;
          }
          text = text + `, ${home.address.postalCode} ${home.address.city}, ${home.address.country}`;
          return { value: home.id, text: text };
        });
        if (!this.flexibleTariff.configuration.home_id) {
          this.updateConfiguration(this.tibberHomeList[0].value, "configuration.home_id");
        }
        this.$root.postClientMessage("Home IDs erfolgreich abgerufen.", "success");
      } catch (error) {
        console.error(error);
        this.$root.postClientMessage(
          "Beim Abfragen der Tibber API ist ein Fehler aufgetreten!<pre>" + error + "</pre>",
          "danger",
        );
      }
    },
  },
};
</script>
