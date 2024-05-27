<template>
	<InstallAssistantStepTemplate
		title="5. Ladepunkte einrichten"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Enthält die steuernde openWB Ladetechnik, wird bei Ladepunkte
				unter verfügbare Ladepunkte "Interne openWB" ausgewählt.
				Ansonsten wird "Externe openWB" und Bauart (der secondary
				openWB) ausgewählt und die IP-Adresse der anderen openWB
				(secondary openWB) und die Ladepunkt-Nummer eingetragen. Bei der
				openWB Duo als secondary openWB können zwei Ladepunkte mit der
				Nummer 1 und 2 hinzugefügt werden.
			</p>
			<p>
				Bei vorkonfigurierten openWBs ist ab Werk bereits ein (zwei bei
				einer DUO) interner Ladepunkt eingetragen.
			</p>
			<p>
				Unter Elektrischer Anschluss Phase 1 des Ladekabels muss die
				Phase der Wallbox-Zuleitung korrekt ausgewählt werden, damit das
				Lastmanagement im Betrieb korrekt arbeiten kann.
			</p>
			<p>
				Bei mehreren openWBs ist es sinnvoll die Ladepunkte auf
				unterschiedliche Phasen aufzuteilen.
			</p>
			<p>
				Bitte lesen Sie dazu auch die Hinweistexte im rechten Fenster,
				welche durch klicken auf das umrundete Fragezeichensymbol hinter
				den Menüpunkten aufgerufen werden können.
			</p>
			<p class="font-weight-bold">
				Änderungen werden nur bei klicken auf speichern wirksam
			</p>
		</template>
		<template v-slot:content>
			<ChargePointInstallationView
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
import ChargePointInstallationView from "../../views/ChargePointInstallation.vue";

export default {
	name: "InstallAssistantStep6",
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
		ChargePointInstallationView,
	},
	data: () => ({
		mqttTopicsToSubscribe: [],
	}),
	methods: {
		nextPage() {
			this.$emit("switchPage", 7);
		},
		previousPage() {
			this.$emit("switchPage", 5);
		},
		endAssistant() {
			this.$emit("endAssistant");
		},
	},
};
</script>
