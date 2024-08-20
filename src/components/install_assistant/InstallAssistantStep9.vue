<template>
	<InstallAssistantStepTemplate
		:title="`${stepNumber}. Datensicherung - Eine Sicherung erstellen`"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Wir empfehlen an dieser Stelle eine Sicherung der openWB zu
				erzeugen.
			</p>
			<p>
				Dieser Vorgang sollte regelmäßig durchgeführt werden, um
				gegebenenfalls auf eine ältere Konfiguration zurückgreifen zu
				können.
			</p>
			<p>
				Die Sicherung kann automatisiert durch die openWB auf einem
				Cloud-Dienst gespeichert werden. Dazu bitte im unteren Bereich
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
