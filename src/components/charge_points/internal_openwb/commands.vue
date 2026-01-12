<template>
  <div class="charge-point-commands-internal-openwb">
    <div v-if="chargePoint.configuration.mode == 'pro_plus'">
      <openwb-base-button-input
        title="Ladepunkt aktualisieren"
        button-text="Update anfordern"
        subtype="success"
        @button-clicked="triggerUpdate"
      >
        <template #help>
          Hier kannst Du die Aktualisierung der openWB Pro anstoßen. Bitte stelle sicher, dass kein Fahrzeug angesteckt
          ist.
        </template>
      </openwb-base-button-input>
      <openwb-base-button-input
        title="Einstellungen öffnen"
        button-text="Zu den Einstellungen"
        subtype="success"
        @button-clicked="openSettings"
      >
        <template #help>
          Mit diesem Befehl kannst Du die Einstellungen der openWB Pro in einem neuen Browser-Tab oder -Fenster öffnen.
        </template>
      </openwb-base-button-input>
    </div>
    <openwb-base-alert
      v-else
      subtype="secondary"
    >
      Der Ladepunkt-Typ "{{ chargePoint.type }}" bietet für die Bauart "{{ mode }}" keine Befehle an.
    </openwb-base-alert>
  </div>
</template>

<script>
import ChargePointCommandsMixin from "../ChargePointCommandsMixin.vue";

export default {
  name: "ChargePointCommandsInternalOpenwb",
  mixins: [ChargePointCommandsMixin],
  computed: {
    mode() {
      switch (this.chargePoint.configuration.mode) {
        case "series":
          return "openWB series1/2 custom, standard & standard+";
        case "duo":
          return "openWB series1/2 Duo";
        case "socket":
          return "openWB series1/2 Buchse";
        case "pro_plus":
          return "openWB Pro+";
        default:
          return this.chargePoint.configuration.mode;
      }
    },
  },
  methods: {
    async triggerUpdate() {
      let formData = new FormData();
      formData.append("command", "update_pro_plus");
      const startedMessage = "Die Aktualisierung der openWB Pro+ wird gestartet...";
      this.$root.postClientMessage(startedMessage, "info");
      console.debug(location);
      this.axios
        .post(
          location.protocol +
            "//" +
            location.host +
            "/openWB/web/settings/modules/charge_points/internal_openwb/commands.php",
          formData,
          { timeout: 5000 },
        )
        .then(() => {
          const successMessage = "Die Aktualisierung der openWB Pro+ wurde erfolgreich gestartet.";
          this.$root.postClientMessage(successMessage, "success");
        })
        .catch((error) => {
          var alertMessage = "Aktualisierung fehlgeschlagen!<br />";
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(error.response.status, error.response.data);
            alertMessage += error.response.status + ": " + error.response.data;
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.error(error.request);
            alertMessage += "Es wurde keine Antwort vom Server empfangen.";
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error", error.message);
            alertMessage += "Es ist ein unbekannter Fehler aufgetreten.";
          }
          this.$root.postClientMessage(alertMessage, "danger");
        });
    },
    openSettings() {
      window.open("http://" + location.hostname + ":8080", "_blank");
    },
  },
};
</script>
