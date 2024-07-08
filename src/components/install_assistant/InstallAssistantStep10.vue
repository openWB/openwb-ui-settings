<template>
	<InstallAssistantStepTemplate
		title="Abgeschlossen"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
		:hideNext="true"
	>
		<template v-slot:content>
			<h2>Die Grundkonfiguration ist abgeschlossen.</h2>
			<p>
				Die grundlegende Konfiguration der openWB ist abgeschlossen. Du
				wirst mit Beendigung dieses Assistenten auf die Statusseite
				weitergeleitet. Bitte überprüfe die dargestellten Informationen
				und passe bei Unstimmigkeiten die Einstellungen an. Weitere
				Einstellungen sind für den Betrieb der openWB als secondary
				nicht notwendig. Detaillierte Einstellungsmöglichkeiten befinden
				sich in den jeweiligen Konfigurationsseiten.
			</p>
		</template>
	</InstallAssistantStepTemplate>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import InstallAssistantStepTemplate from "./InstallAssistantStepTemplate.vue";

export default {
	name: "InstallAssistantStep10",
	mixins: [ComponentState],
	emits: ["switchPage", "endAssistant"],
	components: {
		InstallAssistantStepTemplate,
	},
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
