<script>
import ComponentState from "../mixins/ComponentState.vue";
import InstallAssistantStepTemplate from "./InstallAssistantStepTemplate.vue";
export default {
	name: "InstallAssistantStep2",
	mixins: [ComponentState],
	emits: ["switchPage"],
	components: {
		InstallAssistantStepTemplate,
	},
	data: () => ({
		topicsToSubscribe: [],
	}),
	methods: {
		nextPage() {
			return;
		},
		previousPage() {
			this.$emit("switchPage", 1);
		},
		sendCommand(event) {
			this.$emit("sendCommand", event);
		},
	},
}
</script>

<template>
	<InstallAssistantStepTemplate
		title="Abgeschlossen"
		@nextPage="nextPage"
		@previousPage="previousPage"
		:hideNext="true"
	>
		<template v-slot:content>
			<h2>
				Die Grundkonfiguration ist jetzt abgeschlossen.
			</h2>
			<p>
				Bitte überprüfe die Ergebnisse im Status und
				passe bei Unstimmigkeiten die Einstellungen an.
			</p>
		</template>
	</InstallAssistantStepTemplate>
</template>