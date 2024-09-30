<template>
  <InstallAssistantStepTemplate
    :title="`${stepNumber}. Datensicherung - Eine Sicherung erstellen`"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>
        Wir empfehlen an dieser Stelle eine Sicherung der openWB zu
        erzeugen.
      </p>
      <p>
        Dieser Vorgang sollte regelmäßig durchgeführt werden, um
        gegebenenfalls auf eine ältere Konfiguration zurückgreifen zu
        können.
      </p>
      <p>
        Die Sicherung kann automatisiert durch die openWB auf einem
        Cloud-Dienst gespeichert werden. Dazu bitte im unteren Bereich
        "Backup-Cloud" die entsprechenden Einstellungen vornehmen.
      </p>
    </template>
    <template #content>
      <DataManagement
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
import DataManagement from "../../views/DataManagement.vue";

export default {
  name: "InstallAssistantStep9",
  components: {
    InstallAssistantStepTemplate,
    DataManagement,
  },
  mixins: [ComponentState],
  emits: [
    "save",
    "reset",
    "defaults",
    "sendCommand",
    "switchPage",
    "endAssistant",
  ],
  data: () => ({
    mqttTopicsToSubscribe: ["openWB/general/extern"],
  }),
  computed: {
    stepNumber() {
      return this.$store.state.mqtt["openWB/general/extern"] ? 5 : 8;
    },
  },
  methods: {
    nextPage() {
      this.$emit("switchPage", 10);
    },
    previousPage() {
      this.$emit(
        "switchPage",
        this.$store.state.mqtt["openWB/general/extern"] ? 4 : 8,
      );
    },
    endAssistant() {
      this.$emit("endAssistant");
    },
  },
};
</script>
