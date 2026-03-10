<template>
  <InstallAssistantStepTemplate
    title="5. Energiesystem - Geräte und Komponenten einrichten"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>
        Für die Regelung werden aktuelle Leistungswerte des EVU-Zählers, der PV-Anlage und ggf. eines Speichers
        benötigt.
      </p>
      <p>
        Sofern das System nicht zurückgesetzt wurde, ist im Auslieferungszustand für erste Ladetests ein virtueller
        Zähler vorkonfiguriert. Dieser muss zuerst gelöscht werden, wenn das im Gebäude installierte Energiesystem
        konfiguriert wird.
      </p>
      <p>
        Alle Komponenten, welche über die gleiche IP-Adresse erreichbar sind werden als ein Gerät verstanden. Dieses
        Gerät ist über den Herstellernamen des Energiesystems im Auswahlmenü der verfügbaren Geräte auszuwählen.
        Unterhalb des Gerätes werden die zugehörigen Komponenten EVU-Zähler, WR und Speicher konfiguriert. Es können je
        nach Bedarf beliebig viele Geräte und Komponenten miteinander kombiniert werden.
      </p>
      <p class="font-weight-bold">Änderungen werden nur durch Klicken auf Speichern wirksam!</p>
    </template>
    <template #content>
      <HardwareInstallationView
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
import HardwareInstallationView from "../../views/HardwareInstallation.vue";

export default {
  name: "InstallAssistantStep5",
  components: {
    InstallAssistantStepTemplate,
    HardwareInstallationView,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults", "sendCommand", "switchPage", "endAssistant"],
  data: () => ({
    mqttTopics: [],
  }),
  methods: {
    nextPage() {
      this.$emit("switchPage", 6);
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
