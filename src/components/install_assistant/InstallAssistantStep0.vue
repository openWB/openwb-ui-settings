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
				<li>
					Datensicherung - Eine Sicherung erstellen
				</li>
				<li>Aktualisierung des Systems</li>
				<li>
					Allgemeine Einstellungen: Auswahl des Betriebsmodus primary / secondary
				</li>
				<li>Einrichten der Ladepunkte (openWB als secondary)</li>
			</ol>
			<p>
				Wird diese openWB als secondary betrieben, dann werden nur noch
				die lokalen Ladepunkte eingerichtet. Im Betriebsmodus primary
				werden die folgenden zusätzlichen Schritte durchlaufen:
			</p>
			<ol>
				<li>Energiesystem - Geräte und Komponenten einrichten</li>
				<li>Einrichten der Ladepunkte (openWB als primary)</li>
				<li>Konfiguration des Lastmanagements</li>
				<li>Einrichten der Fahrzeuge</li>
				<li>
					Datensicherung - Eine Sicherung erstellen
				</li>
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
		topicsToSubscribe: [],
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