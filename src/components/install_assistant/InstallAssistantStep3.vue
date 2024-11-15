<template>
  <InstallAssistantStepTemplate
    title="3. Allgemeine Einstellungen: Auswahl des Betriebsmodus primary (steuernd) bzw. secondary (gesteuerte WB)"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>
        Hier wird abgefragt, ob Dein System mit mehreren openWBs oder nur mit einer openWB betrieben wird. Eine openWB
        kann andere openWBs steuern.
      </p>
      <p>
        Zuerst ist im Feld "Steuerungsmodus" festzulegen, ob die openWB als "steuernd" (primary) oder als ferngesteuert
        (secondary) arbeiten soll. Die Einstellung gilt für genau die WB, auf der aktuell konfiguriert wird (korrekte
        IP-Adresse beachten).
      </p>
      <p>
        Eine openWB standalone hat keinen Ladepunkt und arbeitet nur als Steuerteil (primary). Eine openWB Standard(+),
        custom, Duo und Buchse können sowohl als steuernder primary oder als ferngesteuerte secondary betrieben werden
        (Duo mit 2 Ladepunkten). Eine openWB Pro und Satellit können nur als s.g. Ladepunkt genutzt werden und benötigen
        zwingend einen separaten primary als Steuerteil.
      </p>
      <p>
        Sofern openWB als Energiemanagementsystem für steuerbare Verbrauchseinrichtungen (SteuVE) gemäß §14a EnWG
        verwendet werden soll, so ist für die VNB-Signaleingänge die entsprechende Hardware auszuwählen. -> s.
        Beschreibung zu "Steuerbare Verbrauchseinrichtung".
      </p>
      <p class="font-weight-bold">Änderungen werden nur durch Klicken auf Speichern wirksam!</p>
    </template>
    <template #content>
      <GeneralConfigView
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
import GeneralConfigView from "../../views/GeneralConfig.vue";

export default {
  name: "InstallAssistantStep3",
  components: {
    InstallAssistantStepTemplate,
    GeneralConfigView,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults", "sendCommand", "switchPage", "endAssistant"],
  data: () => ({
    mqttTopicsToSubscribe: ["openWB/general/extern"],
  }),
  methods: {
    nextPage() {
      this.$emit("switchPage", this.$store.state.mqtt["openWB/general/extern"] ? 4 : 5);
    },
    previousPage() {
      this.$emit("switchPage", 2);
    },
    endAssistant() {
      this.$emit("endAssistant");
    },
  },
};
</script>
