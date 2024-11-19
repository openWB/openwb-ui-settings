<template>
  <InstallAssistantStepTemplate
    title="4. Energiesystem - Geräte und Komponenten einrichten"
    @next-page="nextPage"
    @previous-page="previousPage"
    @end-assistant="endAssistant"
  >
    <template #help>
      <p>
        Diese openWB wurde als "primary" konfiguriert und übernimmt die Steuerung anderer openWBs, falls vorhanden,
        sowie die alleinige Regelung des Systems. Dazu müssen im Folgenden die Geräte und Komponenten eingerichtet
        werden.
      </p>
      <p>
        Sofern das System nicht zurückgesetzt wurde, ist im Auslieferungszustand für erste Ladetests nach der WB-Montage
        ein virtueller Zähler vorkonfiguriert. Dieser muss zuerst gelöscht werden, wenn das im Gebäude installierte
        Energiesystem bestehend aus EVU-Zähler, PV-Anlage und ggf. Speicher in openWB konfiguriert wird.
      </p>
      <p>
        Jedes verfügbare Gerät wird durch eine eigene IP-Adresse definiert. Dieses Gerät ist über den Herstellernamen
        des Energiesystems im Auswahlmenü der verfügbaren Geräte auszuwählen. Unterhalb des Gerätes werden die
        zugehörigen Komponenten EVU-Zähler, WR und Speicher konfiguriert. Es können je nach Bedarf beliebig viele Geräte
        und Komponenten miteinander kombiniert werden.
      </p>
      <p>
        Bitte lesen Sie auch die Hinweistexte, welche durch Klicken auf das Fragezeichensymbol erscheinen. Hier sind
        weiterführende Informationen zu den Eingabefeldern zu finden.
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
    mqttTopicsToSubscribe: [],
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
