<template>
	<InstallAssistantStepTemplate
		title="3. Allgemeine Einstellungen"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Hier wird abgefragt, ob ihr System mit mehreren openWBs oder nur
				mit einer openWB betrieben wird. Eine openWB kann andere openWBs
				steuern, wobei für jeden Ladepunkt eine openWB benötigt wird.
			</p>
			<p>
				Hierzu das Feld Steuerungsmodus (primary oder secondary)
				auswählen.
			</p>
			<p>
				Eine openWB standalone hat keinen Ladepunkt (nur primary). Eine
				openWB Standard(+), custom, Duo und Buchse können als primary
				oder secondary betrieben werden. Eine openWB Pro und Satellit
				können nur als secondary (als ein Ladepunkt) angeschlossen
				werden. Eine openWB Duo kann zwei Ladepunkte bedienen.
			</p>
		</template>
		<template v-slot:content>
			<GeneralConfigView
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
import GeneralConfigView from "../../views/GeneralConfig.vue";

export default {
	name: "InstallAssistantStep3",
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
		GeneralConfigView,
	},
	data: () => ({
		mqttTopicsToSubscribe: ["openWB/general/extern"],
	}),
	methods: {
		nextPage() {
			this.$emit(
				"switchPage",
				this.$store.state.mqtt["openWB/general/extern"] ? 4 : 5,
			);
		},
		previousPage() {
			this.$emit("switchPage", 2);
		},
		endAssistant() {
			this.$emit("endAssistant");
		},
	},
};
</script>