<template>
	<InstallAssistantStepTemplate
		title="Start"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
		:hidePrevious="true"
	>
		<template v-slot:content>
			<h2>Vielen Dank, dass Du Dich für openWB entschieden hast.</h2>
			<p>
				Dieser Assistent führt Dich durch die Konfiguration der
				einzelnen Module:
			</p>
			<ol>
				<li>Datensicherung der bestehenden Konfiguration</li>
				<li>Aktualisierung des openWB-Systems</li>
				<li>
					Allgemeine Einstellungen: Auswahl des Betriebsmodus primary
					(steuernd) bzw. secondary (gesteuerte WB)
				</li>
			</ol>
			<p>
				Wird diese openWB als secondary betrieben, so werden nur die
				lokalen Ladepunkte eingerichtet. Im Betriebsmodus primary werden
				die folgenden zusätzlichen Schritte durchlaufen:
			</p>
			<ol start="4">
				<li>Energiesystem - Geräte und Komponenten einrichten</li>
				<li>Einrichten der Ladepunkte (openWB als primary)</li>
				<li>Konfiguration des Lastmanagements</li>
				<li>Einrichten der Fahrzeuge</li>
				<li>Datensicherung der neuen Konfiguration</li>
			</ol>
			<p>Danach ist die Grundkonfiguration abgeschlossen.</p>
		</template>
	</InstallAssistantStepTemplate>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import InstallAssistantStepTemplate from "./InstallAssistantStepTemplate.vue";

export default {
	name: "InstallAssistantStep0",
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
			this.$emit("switchPage", 1);
		},
		previousPage() {
			return;
		},
		endAssistant() {
			this.$emit("endAssistant");
		},
	},
};
</script>
