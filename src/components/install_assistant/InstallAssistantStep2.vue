<template>
	<InstallAssistantStepTemplate
		title="2. Aktualisierung des openWB-Systems"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Bitte ein System-Update durchführen, um die Software auf den
				neuesten Stand der Features und Funktionen zu bringen.
			</p>
			<p>
				Hierzu Versions-Informationen / Aktualisierung auswählen,
				Informationen aktualisieren klicken und falls ein Update
				verfügbar ist, wird der Update button grün (zum Update bereit).
			</p>
			<p>
				Bei openWB Systemen mit integriertem Display muss nach
				Zurücksetzen auf Werkseinstellungen oder nach Ausführen eines
				Updates das Display wieder eingeschalten werden.
			</p>
			<p>
				Ein Klick auf "Änderungen" zeigt die Modifikationen. Ein Klick
				auf "Update" startet die Aktualisierung, welche auch einen
				automatischen Reboot initiiert (bitte ca. 5 min warten). Danach
				muss der Assistent neu gestartet werden.
			</p>
		</template>
		<template v-slot:content>
			<SystemView
				:installAssistantActive="true"
				@send-command="$emit('sendCommand', $event)"
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
			<OptionalComponents
				:installAssistantActive="true"
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
import SystemView from "../../views/System.vue";
import OptionalComponents from "../../views/OptionalComponents.vue";

export default {
	name: "InstallAssistantStep2",
	mixins: [ComponentState],
	emits: [
		"save",
		"reset",
		"defaults",
		"sendCommand",
		"switchPage",
		"endAssistant",
	],
	components: {
		InstallAssistantStepTemplate,
		SystemView,
		OptionalComponents,
	},
	data: () => ({
		mqttTopicsToSubscribe: [],
	}),
	methods: {
		nextPage() {
			this.$emit("switchPage", 3);
		},
		previousPage() {
			this.$emit("switchPage", 1);
		},
		endAssistant() {
			this.$emit("endAssistant");
		},
	},
};
</script>
