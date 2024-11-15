<template>
  <InstallAssistantStepTemplate
    title="5. Einrichten der Ladepunkte (openWB als primary)"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>
        Enthält die steuernde openWB (primary) Ladetechnik, wird bei "Verfügbare Ladepunkte" Interne openWB ausgewählt.
        Weitere LP werden im primary als Externe openWB (als secondary konfigurierte openWB) oder andere WB-Typen wie
        Pro, Satellit eingebunden.
      </p>
      <p>Bei openWBs ab Werk kann hier bereits ein Ladepunkt eingetragen sein.</p>
      <p>
        Nachfolgend werden die Eigenschaften des Ladepunktes wie IP-Adresse und elektrischer Anschluss definiert. Die
        meisten openWB werden 3-phasig angeschlossen! Bei mehreren Ladepunkten ist auf phasenrotierten Anschluss der
        openWB-Zuleitung zu achten! Abschließend wird die korrekte Zuordnung der Phase 1 des Ladekabels zur zugehörigen
        EVU-Zählerphase konfiguriert. Dies ist sehr wichtig, um optimales Lastmanagement sicherzustellen!
      </p>
      <p>
        Tipp zur Zuordnung: Verwende ein nur 1-phasig ladendes Auto (z.B. Hybrid) oder stelle bei openWB mit
        1p3p-Phasenumschaltung temporär unter Sofortladen (s. Einstellungen -> Ladeeinstellungen) auf einphasig, um eine
        1-phasige Ladung zu erzwingen. Gehe unter Status und vergleiche die Leistungen bzw. Ströme der 3 Phasen am
        EVU-Zähler (rot) beim und nach dem Autoladen (Sofortladen mit 16A/ Stop). Diejenige EVU-Phase, die deutlich
        erhöhte Werte anzeigt, ist die auszuwählende EVU-Phase.
      </p>
      <p>
        Im grauen Menü Ladepunkt-Profile können neben dem Standard-Ladepunkt-Profil auch weitere Ladepunkt-Profile, die
        andere WB-Typen abbilden, erstellt werden. Dort sind Eintragungen bzgl. des Ladepunkt-Maximalstroms bei einer
        Phase bzw. mehreren Phasen vorzunehmen. Die Profile werden abschließend im jeweiligen blauen Ladepunkt mittels
        Auswahlmenü zugeordnet.
      </p>
      <p class="font-weight-bold">Änderungen werden nur durch Klicken auf Speichern wirksam!</p>
    </template>
    <template #content>
      <ChargePointInstallationView
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
import ChargePointInstallationView from "../../views/ChargePointInstallation.vue";

export default {
  name: "InstallAssistantStep6",
  components: {
    InstallAssistantStepTemplate,
    ChargePointInstallationView,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults", "sendCommand", "switchPage", "endAssistant"],
  data: () => ({
    mqttTopicsToSubscribe: [],
  }),
  methods: {
    nextPage() {
      this.$emit("switchPage", 7);
    },
    previousPage() {
      this.$emit("switchPage", 5);
    },
    endAssistant() {
      this.$emit("endAssistant");
    },
  },
};
</script>
