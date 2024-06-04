<template>
	<InstallAssistantStepTemplate
		title="3. Konfiguration des Lastmanagements"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Im Lastmanagement werden die maximale Leistung sowie die
				maximalen Ströme für jede Phase des Zählermoduls sowie bei Hybrid-Systemen (per DC-angebundener Speicher) 
				die maximale Ausgangsleistung des Wechselrichters der PV Anlage
				eingetragen, falls eine solche vorhanden ist.
			</p>
			<p>Der erste Zähler ist in der Regel der Zähler am EVU-Punkt (Position des PV/Speicher-Smartmeters direkt 
				hinter dem VNB-Zähler). In openWB ist hierzu auf die unterhalb der "Vorhandene Zählermodule" liegende 
				(rote) EVU-Zähler-Komponente zu klicken, in welche die maximale EVU-Leistung sowie die Phasenströme eingetragen 
				werden, für die der Hausanschluss abgesichert ist (Elektriker fragen, typisch f. EFH: 24kW/3x35A, 43kW/3x63A).
			</p>
			<p>
				Ist ein Wechselrichter mit DC-angebundenem Speicher unter Geräte hinzugefügt worden, 
				dann ist unter der (grünen) WR-Komponente noch die maximale Ausgangsleistung des WR einzutragen.
			</p>
			<p>
				Der EVU-Zähler (rot) schließt alle weiteren Komponenten wie WR und Speicher unter sich ein.
				Bei AC-eingebundenen Speichern befinden sich WR und Speicher in derselben Ebene, bei DC-eingebundenen 
				Speichern (Hybrid) der Speicher unterhalb des WR. Die Ladepunkte (z.B. Externe openWB) befinden sich auf 
				derselben Ebene wie der WR und unterhalb des EVU-Zählers. Anpassungen der Anordnungen sind über die 
				Pfeil-Bereiche der Komponenten durch einfaches Verschieben mit der Maus möglich.
			</p>
			<p>
			</p>
			<p class="font-weight-bold">
				Änderungen werden nur bei Klicken auf Speichern wirksam!
			</p>
		</template>
		<template v-slot:content>
			<LoadManagementConfigView
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
import LoadManagementConfigView from "../../views/LoadManagementConfig.vue";

export default {
	name: "InstallAssistantStep7",
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
		LoadManagementConfigView,
	},
	data: () => ({
		mqttTopicsToSubscribe: [],
	}),
	methods: {
		nextPage() {
			this.$emit("switchPage", 8);
		},
		previousPage() {
			this.$emit("switchPage", 6);
		},
		endAssistant() {
			this.$emit("endAssistant");
		},
	},
};
</script>