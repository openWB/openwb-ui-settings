<template>
  <InstallAssistantStepTemplate
    title="9. Energiekosten"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>
        Der Stromtarif wird für die Berechnung der Ladekosten und für das preisbasierte Laden verwendet. Trage hier
        einen Anbieter mit dynamischen Preisen ein, wähle "Fester Preis" für einen gleichbleibenden Preis oder
        "Zeitabhängiger Tarif (HT/NT)" für Hoch- und Niedertarif.
      </p>
      <p>
        Wird kein Stromtarif eingerichtet, rechnet openWB die Ladekosten mit einem Standardpreis. Der Preis für
        Erzeugung und der Preis für Speicherentladung können hier ebenfalls angepasst werden.
      </p>
      <p class="font-weight-bold">Änderungen werden nur durch Klicken auf Speichern wirksam!</p>
    </template>
    <template #content>
      <ElectricityPricesConfigurationView
        @save="$emit('save', $event)"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </template>
  </InstallAssistantStepTemplate>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import InstallAssistantStepTemplate from "./InstallAssistantStepTemplate.vue";
import ElectricityPricesConfigurationView from "../../views/ElectricityPricesConfiguration.vue";

export default {
  name: "InstallAssistantStep9",
  components: {
    InstallAssistantStepTemplate,
    ElectricityPricesConfigurationView,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults", "sendCommand", "switchPage", "endAssistant"],
  data: () => ({
    mqttTopics: [],
  }),
  methods: {
    nextPage() {
      this.$emit("switchPage", 10);
    },
    previousPage() {
      this.$emit("switchPage", 8);
    },
    endAssistant() {
      this.$emit("endAssistant");
    },
  },
};
</script>
