<template>
  <InstallAssistantStepTemplate
    title="Abgeschlossen"
    :hide-next="true"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #content>
      <h2>Die Grundkonfiguration ist abgeschlossen.</h2>
      <p>
        Die grundlegende Konfiguration der openWB ist abgeschlossen. Du wirst mit Beendigung dieses Assistenten auf die
        Statusseite weitergeleitet. Bitte überprüfe die dargestellten Informationen und passe bei Unstimmigkeiten die
        Einstellungen in den jeweiligen Konfigurationsseiten an (openWB -> Einstellungen -> Konfiguration).
      </p>
    </template>
  </InstallAssistantStepTemplate>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import InstallAssistantStepTemplate from "./InstallAssistantStepTemplate.vue";

export default {
  name: "InstallAssistantStep10",
  components: {
    InstallAssistantStepTemplate,
  },
  mixins: [ComponentState],
  emits: ["switchPage", "endAssistant", "sendCommand"],
  data: () => ({
    mqttTopicsToSubscribe: [],
  }),
  methods: {
    nextPage() {
      return;
    },
    previousPage() {
      this.$emit("switchPage", 9);
    },
    sendCommand(event) {
      this.$emit("sendCommand", event);
    },
    endAssistant() {
      this.$emit("endAssistant");
    },
  },
};
</script>
