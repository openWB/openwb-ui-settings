<template>
	<InstallAssistantStepTemplate
		title="1. Datensicherung"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Wir empfehlen an dieser Stelle eine Sicherung der openWB zu
				erzeugen, auf welche später zurückgegriffen werden kann,
				insbesondere, wenn die openWB schon konfiguriert war und der
				Assistent nun erneut ausgeführt wird.
			</p>
			<p>
				Dazu im Abschnitt "Sicherung / Wiederherstellung" auf Sicherung
				erstellen klicken.
			</p>
			<p>
				Es wird empfohlen regelmäßig Sicherungen der Daten zu erstellen.
				Der Vorgang kann auch automatisiert werden, indem unter
				"Backup-Cloud" ein Dienst ausgewählt wird.
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
	name: "InstallAssistantStep1",
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
		mqttTopicsToSubscribe: [],
	}),
	methods: {
		nextPage() {
			this.$emit("switchPage", 2);
		},
		previousPage() {
			this.$emit("switchPage", 0);
		},
		endAssistant() {
			this.$emit("endAssistant");
		},
	},
};
</script>
