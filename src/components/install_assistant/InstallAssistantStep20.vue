<template>
  <InstallAssistantStepTemplate
    title="4. Einrichten der Ladepunkte (openWB als secondary)"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>
        Diese openWB wurde als "secondary" eingestellt und wird von einer anderen openWB oder standalone ferngesteuert.
      </p>
      <p>
        Bei vorkonfigurierten openWBs ist ab Werk bereits ein (zwei bei einer Duo) interner Ladepunkt eingetragen. Es
        müssen keine weiteren Ladepunkte hinzugefügt werden.
      </p>
      <p>
        Trage unter Ladepunkte bei verfügbare Ladepunkte "Interne openWB" ein und wähle die Bauart der openWB (z.B.
        openWB series 1/2 custom, Standard (+), Buchse oder Pro+) aus.
      </p>
      <p>Wenn eine openWB Duo gewählt wird, so sind zwei Ladepunkte mit Ladepunkt-Nummer 1 und 2 zu konfigurieren.</p>
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
  name: "InstallAssistantStep4",
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
      this.$emit("switchPage", 9);
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
