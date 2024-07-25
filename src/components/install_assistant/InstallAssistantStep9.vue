<template>
	<InstallAssistantStepTemplate
		:title="`${stepNumber}. Datensicherung der neuen Konfiguration`"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Wir empfehlen an dieser Stelle eine manuell initiierte Sicherung
				der neu konfigurierten openWB zu erstellen.
			</p>
			<p>
				Dieser Vorgang sollte im Betrieb regelmäßig wiederholt werden
				(mindestens vor Updates), um sowohl die individuellen Log-Daten
				als auch auf ältere Konfigurationen zurückgreifen zu können
				(Backups).
			</p>
			<p>
				Die Sicherung kann auch automatisiert auf einem Cloud-Dienst
				durchgeführt werden. Hierzu bitte im unteren Bereich
				"Backup-Cloud" die entsprechenden Einstellungen vornehmen.
			</p>
		</template>
		<template v-slot:content>
			<DataManagement
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
import DataManagement from "../../views/DataManagement.vue";

export default {
	name: "InstallAssistantStep9",
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
		DataManagement,
	},
	data: () => ({
		mqttTopicsToSubscribe: ["openWB/general/extern"],
	}),
	computed: {
		stepNumber() {
			return this.$store.state.mqtt["openWB/general/extern"] ? 5 : 8;
		},
	},
	methods: {
		nextPage() {
			this.$emit("switchPage", 10);
		},
		previousPage() {
			this.$emit(
				"switchPage",
				this.$store.state.mqtt["openWB/general/extern"] ? 4 : 8,
			);
		},
		endAssistant() {
			this.$emit("endAssistant");
		},
	},
};
</script>
