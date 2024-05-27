<template>
	<InstallAssistantStepTemplate
		title="7. Fahrzeuge einrichten"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Zuerst Fahrzeug-Profile und Lade-Profile konfigurieren. In den
				meisten Fällen reicht das Standard-Fahrzeug-Profil aus, wenn
				alle Autos mit dem gleichen Lademodus geladen werden.
			</p>
			<p>
				Für jedes Modell eine Vorlage auswählen und die Einstellungen
				Mindeststromstärke, Maximalstromstärke bei einer/mehreren
				Phase/n sowie Angaben zur Batterie und Handhabung der Phasen
				entsprechend den Daten des Automobilherstellers eintragen. Im
				Zweifelsfall den Hersteller des Fahrzeugs oder in unserem Forum
				fragen.
			</p>
			<p>
				In den meisten Fällen sind die Einstellungen im
				Standard-Lade-Profil für sofortiges Laden ausreichend, eventuell
				Soll-Ladestrom anpassen. Ansonsten ein eigenes Lade-Profil
				anlegen. Dann Fahrzeug anlegen und Fahrzeug-Profil und
				Lade-Profil dem entsprechenden Fahrzeug zuordnen.
			</p>
			<p>
				Sind am Standort mehrere Fahrzeuge vorhanden und sollen diese in
				unterschiedlichen Modi geladen werden (z.B. eines mit PV-
				Überschuss und eines mit Modus Sofortladen), dann ist für jedes
				Fahrzeug ein eigenes Lade-Profil anzulegen.
			</p>
			<p class="font-weight-bold">
				Wichtig: Die "Angaben zur Handhabung von Phasen" des Fahrzeugs
				ist richtig einzutragen!
			</p>
			<p>
				Kennt man die richtigen Einstellungen für das Fahrzeugs nicht
				(z.B. Besucherfahrzeug), besser ein Fahrzeug-Profil anlegen,
				welches die Phasenumschaltung blockiert.
			</p>
			<p class="font-weight-bold">
				Änderungen werden nur bei klicken auf speichern wirksam
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
