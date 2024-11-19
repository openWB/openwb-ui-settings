<template>
  <InstallAssistantStepTemplate
    title="7. Einrichten der Fahrzeuge"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>Vor dem eigentlichen Fahrzeug werden zuerst die Fahrzeug- und Lade-Profile konfiguriert.</p>
      <p>
        Bei nur einem Fahrzeug reicht das Standard-Fahrzeug-Profil aus. Bei mehreren Fahrzeugtypen werden weitere
        Fahrzeug-Profile hinzugefügt. Im Anschluss werden die Fahrzeug-Profile mit den passenden Einstellungen des
        Fahrzeugtyps versehen (Mindeststromstärke, Maximalstromstärke bei einer/mehreren Phase/n sowie Angaben zur
        Batterie und Handhabung der Phasen entsprechend den Daten des Automobilherstellers. Im Zweifelsfall den
        Hersteller des Autos oder im openWB-Forum nachfragen).
      </p>
      <p class="font-weight-bold">
        Wichtig: Die "Angaben zur Handhabung von Phasen" des Fahrzeugs sind richtig einzutragen! Beachte die Hilfstexte,
        die Du durch Klick auf
        <FontAwesomeIcon :icon="['far', 'question-circle']" /> anzeigen kannst.
      </p>
      <p>
        Bei nur einem Fahrzeug reicht das Standard-Lade-Profil aus. Bei mehreren Fahrzeugen können weitere Lade-Profile
        hinzugefügt werden. Dies erlaubt die Nutzung unterschiedlicher Lademodi je Fahrzeug (z.B. EV1 = Sofortladen, EV2
        = PV-Laden). Im Anschluss werden die Voreinstellungen zu den verschiedenen Lademodi konfiguriert.
      </p>
      <p>
        Nun wird das eigentliche Fahrzeug angelegt und mit dem gewünschten Fahrzeug-Profil / Lade-Profil versehen. Ist
        nur ein Fahrzeug vorhanden, reicht das Standard-Fahrzeug aus.
      </p>
      <p class="font-weight-bold">Änderungen werden nur durch Klicken auf Speichern wirksam!</p>
    </template>
    <template #content>
      <VehicleConfigView
        :install-assistant-active="true"
        @send-command="$emit('sendCommand', $event)"
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </template>
  </InstallAssistantStepTemplate>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import InstallAssistantStepTemplate from "./InstallAssistantStepTemplate.vue";
import VehicleConfigView from "../../views/VehicleConfig.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "InstallAssistantStep8",
  components: {
    InstallAssistantStepTemplate,
    VehicleConfigView,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults", "sendCommand", "switchPage", "endAssistant"],
  data: () => ({
    mqttTopicsToSubscribe: [],
  }),
  methods: {
    nextPage() {
      this.$emit("switchPage", 9);
    },
    previousPage() {
      this.$emit("switchPage", 7);
    },
    endAssistant() {
      this.$emit("endAssistant");
    },
  },
};
</script>
