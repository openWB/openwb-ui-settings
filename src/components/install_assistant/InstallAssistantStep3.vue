<template>
	<InstallAssistantStepTemplate
		title="3. Allgemeine Einstellungen: Auswahl des Betriebsmodus primary / secondary"
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
				Zuerst ist im Feld "Steuerungsmodus" festzulegen, ob die openWB als "steuernd"  (primary) 
				oder als ferngesteuert (secondary) arbeiten soll. Die Einstellung gilt für genau die WB, 
				auf der aktuell konfiguriert wird (korrekte IP-Adresse beachten).
			</p>
			<p>
				Eine openWB standalone hat keinen Ladepunkt und arbeitet nur als Steuerteil (primary). 
				Eine openWB Standard(+), custom, Duo und Buchse können sowohl als steuernder primary oder 
				als ferngesteuerte secondary betrieben werden (Duo mit 2 Ladepunkten). Eine openWB Pro und 
				Satellit können nur als s.g. Ladepunkt genutzt werden und benötigen zwingend einen separaten primary
				als Steuerteil.
			</p>
			<p class="font-weight-bold">
						Änderungen werden nur bei Klicken auf Speichern wirksam!
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