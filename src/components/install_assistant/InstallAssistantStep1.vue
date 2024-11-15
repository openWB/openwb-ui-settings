<template>
  <InstallAssistantStepTemplate
    title="1. Datensicherung der bestehenden Konfiguration"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>
        Wir empfehlen an dieser Stelle eine Sicherung der openWB zu erstellen, auf welche später zurückgegriffen werden
        kann, insbesondere, wenn die openWB schon konfiguriert war und der Assistent nun erneut ausgeführt wird.
      </p>
    </template>
    <template #content>
      <DataManagement
        :install-assistant-active="true"
        :show-backup-cloud-section="false"
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
import DataManagement from "../../views/DataManagement.vue";

export default {
  name: "InstallAssistantStep1",
  components: {
    InstallAssistantStepTemplate,
    DataManagement,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults", "sendCommand", "switchPage", "endAssistant"],
  data: () => ({
    mqttTopicsToSubscribe: [],
  }),
  methods: {
    nextPage() {
      this.$emit("switchPage", 2);
    },
    previousPage() {
      this.$emit("switchPage", 0);
    },
    endAssistant() {
      this.$emit("endAssistant");
    },
  },
};
</script>
