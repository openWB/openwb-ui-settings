<template>
	<InstallAssistantStepTemplate
		title="6. Abgeschlossen"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
		:hideNext="true"
	>
		<template v-slot:content>
			<h2>Die Grundkonfiguration ist abgeschlossen.</h2>
			<p>
				Die grundlegende Konfiguration der openWB ist abgeschlossen. Sie
				werden mit Beendigung dieses Assistenten auf die Statusseite
				weitergeleitet. Bitte überprüfe die dargestellten Informationen
				und passe bei Unstimmigkeiten die Einstellungen an.
			</p>
		</template>
	</InstallAssistantStepTemplate>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import InstallAssistantStepTemplate from "./InstallAssistantStepTemplate.vue";

export default {
	name: "InstallAssistantStep9",
	mixins: [ComponentState],
	emits: ["switchPage", "endAssistant"],
	components: {
		InstallAssistantStepTemplate,
	},
	data: () => ({
		topicsToSubscribe: ["openWB/general/extern"],
	}),
	methods: {
		nextPage() {
			return;
		},
		previousPage() {
			this.$emit(
				"switchPage",
				this.$store.state.mqtt["openWB/general/extern"] ? 4 : 9,
			);
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
