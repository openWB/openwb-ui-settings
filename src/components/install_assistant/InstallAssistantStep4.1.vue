<template>
  <InstallAssistantStepTemplate
    title="4. Ein- und Ausgänge konfigurieren"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>Diese openWB ist als "primary" konfiguriert und übernimmt die Regelung des Systems.</p>
      <p class="font-weight-bold">Optional:</p>
      <p> 
        Wird die openWB nicht als als Energiemanagementsystem für
        steuerbare Verbrauchseinrichtungen (SteuVE) gemäß §14a EnWG verwendet,
        <span class="font-weight-bold">kann dieser Schritt übersprungen werden.</span>
      </p>
      <p>
        Soll die openWB als Energiemanagementsystem für steuerbare Verbrauchseinrichtungen (SteuVE) gemäß §14a EnWG
        verwendet werden, so ist für die VNB-Signaleingänge die entsprechende Hardware auszuwählen.
      </p>
      <p class="font-weight-bold">Änderungen werden nur durch Klicken auf Speichern wirksam!</p>
    </template>
    <template #content>
      <IoConfigView
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
import IoConfigView from "../../views/IoConfig.vue";

export default {
  name: "InstallAssistantStep4.1",
  components: {
    InstallAssistantStepTemplate,
    IoConfigView,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults", "sendCommand", "switchPage", "endAssistant"],
  data: () => ({
    mqttTopicsToSubscribe: [],
  }),
  methods: {
    nextPage() {
      this.$emit("switchPage", 5);
    },
    previousPage() {
      this.$emit("switchPage", 3);
    },
    endAssistant() {
      this.$emit("endAssistant");
    },
  },
};
</script>
