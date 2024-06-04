<template>
	<InstallAssistantStepTemplate
		title="4. Einrichten der Fahrzeuge"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Dies ist neu im Vergleich zu sw1.9 und ermöglicht viele nützliche Funktionen (fahrzeugbezogene Abrechnungen,  
				SoC-Auslesungen uvm.). 
				Vor dem eigentlichen Fahrzeug werden zuerst die Fahrzeug- und Lade-Profile konfiguriert.
				Zuerst Fahrzeug-Profile und Lade-Profile konfigurieren. 
			</p>
			<p>
				Bei nur einem Fahrzeug reicht das Standard-Fahrzeug-Profil aus. 
				Bei mehreren Fahrzeugtypen werden weitere Fahrzeug-Profile hinzugefügt. 
				Im Anschluss werden die Fahrzeug-Profile mit den passenden Einstellungen des Fahrzeugtyps versehen 
				(Mindeststromstärke, Maximalstromstärke bei einer/mehreren Phase/n sowie Angaben zur Batterie und Handhabung 
				der Phasen entsprechend den Daten des Automobilherstellers. Im Zweifelsfall den Hersteller des Autos oder im 
				openWB-Forum nachfragen).
			</p>
			<p class="font-weight-bold">
				Wichtig: Die "Angaben zur Handhabung von Phasen" des Fahrzeugs
				ist richtig einzutragen!
			</p>
			<p>
				Bei nur einem Fahrzeug reicht das Standard-Lade-Profil aus. Bei mehreren Fahrzeugen können weitere 
				Lade-Profile hinzugefügt werden. Dies erlaubt die Nutzung unterschiedlicher Lademodi 
				je Fahrzeug (z.B. EV1 = Sofortladen, EV2 PV-Laden), sofern sie an unterschiedlichen Ladepunkten laden. 
				Im Anschluss werden die Voreinstellungen zu den verschiedenen Lademodi konfiguriert.
			</p>
			<p>
				Nun wird das eigentliche Fahrzeug angelegt (bei nur einem Fzg, reicht das Standard-Fahrzeug aus) 
				und mit den gewünschten Fahrzeug-Profil / Lade-Profil versehen.
			</p>
			<p class="font-weight-bold">
				Änderungen werden nur bei Klicken auf Speichern wirksam!
			</p>
		</template>
		<template v-slot:content>
			<VehicleConfigView
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
import VehicleConfigView from "../../views/VehicleConfig.vue";

export default {
	name: "InstallAssistantStep8",
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
		VehicleConfigView,
	},
	data: () => ({
		mqttTopicsToSubscribe: [],
	}),
	methods: {
		nextPage() {
			this.$emit("switchPage", 9);
		},
		previousPage() {
			this.$emit("switchPage", 7);
		},
		endAssistant() {
			this.$emit("endAssistant");
		},
	},
};
</script>
