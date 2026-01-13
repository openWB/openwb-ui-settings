<template>
  <InstallAssistantStepTemplate
    title="3. Auswahl des Steuerungsmodus"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>
        Hier festlegen, ob die openWB als "steuernd" (primary) oder als ferngesteuert (secondary) arbeiten soll. Die
        Einstellung gilt für genau die WB, auf der aktuell konfiguriert wird (korrekte IP-Adresse beachten).
      </p>
      <p>
        Eine openWB standalone hat keinen Ladepunkt und arbeitet nur als Steuerteil (primary). Eine openWB Standard(+),
        custom, Duo (2 Ladepunkte) und Buchse können sowohl als steuernde primary oder als ferngesteuerte secondary
        betrieben werden. Eine openWB Pro und Satellit können nur als s.g. Ladepunkt genutzt werden und benötigen
        zwingend einen separaten primary als Steuerteil.
      </p>
      <p class="font-weight-bold">Änderungen werden nur durch Klicken auf Speichern wirksam!</p>
    </template>
    <template #content>
      <GeneralConfigurationView
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
import GeneralConfigurationView from "../../views/GeneralConfiguration.vue";

export default {
  name: "InstallAssistantStep3",
  components: {
    InstallAssistantStepTemplate,
    GeneralConfigurationView,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults", "sendCommand", "switchPage", "endAssistant"],
  data: () => ({
    mqttTopicsToSubscribe: ["openWB/general/extern"],
  }),
  methods: {
    nextPage() {
      this.$emit("switchPage", this.$store.state.mqtt["openWB/general/extern"] ? 20 : 4);
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
