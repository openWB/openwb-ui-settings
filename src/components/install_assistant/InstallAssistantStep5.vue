<template>
	<InstallAssistantStepTemplate
		title="4. Geräte und Komponenten einrichten"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Diese openWB wurde als "primary" konfiguriert und übernimmt die
				Steuerung anderer openWBs, falls vorhanden, sowie die alleinige
				Regelung des Systems. Dazu müssen im Folgenden die Geräte und
				Komponenten eingerichtet werden.
			</p>
			<p>
				Ab Werkseinstellung kann hier bereits ein virtueller Zähler
				vorkonfiguriert sein, welcher gelöscht werden kann, sobald ein
				anderer Zahler für die EVU-Daten konfiguriert wurde.
			</p>
			<p>
				Bei verfügbare Geräte das entsprechenden Gerät auswählen und
				hinzufügen. Danach auf das neue Gerät klicken und für jedes
				verfügbare Gerät die erforderlichen Konfigurationsdaten
				eintragen. Dann unter Verfügbare Komponenten falls vorhanden
				Zähler, Wechselrichter und Speicher hinzufügen.
			</p>
			<p class="font-weight-bold">
				Änderungen werden nur bei klicken auf speichern wirksam
			</p>
		</template>
		<template v-slot:content>
			<HardwareInstallationView
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
import HardwareInstallationView from "../../views/HardwareInstallation.vue";

export default {
	name: "InstallAssistantStep5",
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
		HardwareInstallationView,
	},
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
