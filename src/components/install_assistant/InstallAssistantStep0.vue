<template>
  <InstallAssistantStepTemplate
    title="Start"
    :hide-previous="true"
    @next-page="requestNextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #content>
      <!-- modal dialogs -->
      <openwb-base-modal-dialog
        :show="showModalWarning"
        title="Achtung!"
        subtype="danger"
        :buttons="[{ text: 'Ok', event: 'confirm', subtype: 'success' }]"
        @modal-result="nextPage($event)"
      >
        Bevor der Assistent gestartet wird, ist sicherzustellen, dass kein Ladevorgang aktiv ist! Zur Sicherheit bitte
        zusätzlich alle Fahrzeuge von der Ladestation / den Ladestationen abstecken!
      </openwb-base-modal-dialog>
      <!-- main content -->
      <h2>Vielen Dank, dass Du Dich für openWB entschieden hast.</h2>
      <p>Dieser Assistent führt Dich durch die Konfiguration der einzelnen Module:</p>
      <ol>
        <li>Datensicherung der bestehenden Konfiguration</li>
        <li>Aktualisierung des openWB-Systems</li>
        <li>Allgemeine Einstellungen: Auswahl des Betriebsmodus primary (steuernd) bzw. secondary (gesteuerte WB)</li>
      </ol>
      <p>
        Wird diese openWB als secondary betrieben, so werden nur die lokalen Ladepunkte eingerichtet. Im Betriebsmodus
        primary werden die folgenden zusätzlichen Schritte durchlaufen:
      </p>
      <ol start="4">
        <li>Energiesystem - Geräte und Komponenten einrichten</li>
        <li>Einrichten der Ladepunkte (openWB als primary)</li>
        <li>Konfiguration des Lastmanagements</li>
        <li>Einrichten der Fahrzeuge</li>
        <li>Datensicherung der neuen Konfiguration</li>
      </ol>
      <p>Danach ist die Grundkonfiguration abgeschlossen.</p>
    </template>
  </InstallAssistantStepTemplate>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import InstallAssistantStepTemplate from "./InstallAssistantStepTemplate.vue";

export default {
  name: "InstallAssistantStep0",
  components: {
    InstallAssistantStepTemplate,
  },
  mixins: [ComponentState],
  emits: ["switchPage", "endAssistant"],
  data: () => ({
    mqttTopicsToSubscribe: [],
    showModalWarning: false,
  }),
  methods: {
    requestNextPage() {
      this.showModalWarning = true;
    },
    nextPage(event) {
      this.showModalWarning = false;
      if (event === "confirm") {
        this.$emit("switchPage", 1);
      }
    },
    previousPage() {
      return;
    },
    endAssistant() {
      this.$emit("endAssistant");
    },
  },
};
</script>
