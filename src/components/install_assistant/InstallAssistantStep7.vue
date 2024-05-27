<template>
	<InstallAssistantStepTemplate
		title="6. Lastmanagement einrichten"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Im Lastmanagement werden die maximale Leistung sowie die
				maximalen Ströme für jede Phase des Zählermoduls sowie die
				maximale Ausgangsleistung des Wechselrichters der PV Anlage
				eingetragen, falls ein solcher konfiguriert wurde. Unter dem
				Punkt Vorhandene Zählermodule auf die Komponente des EVU-Zählers
				klicken und die maximale Leistung sowie Phasenströme des
				Hausanschlusses eintragen.
			</p>
			<p>
				Ist ein Wechselrichter unter Geräte hinzugefügt worden, dann
				unter dem Punkt Wechselrichter noch die maximale
				Ausgangsleistung des Wechselrichters eintragen, wenn es sich um
				ein Hybrid-System mit DC-Speicher handelt.
			</p>
			<p>
				Nach klicken auf Struktur ist außerdem die Struktur des
				Lastmanagements zu überprüfen und ggf. anzupassen. Im Normalfall
				befinden sich Speicher und Wechselrichter in einer Ebene
				innerhalb des EVU-Zählers. Die Ladepunkte befinden sich auch in
				der selben Ebene wie der Speicher und der Wechselrichter
				innerhalb der Ebene des EVU-Zählers.
			</p>
			<p>
				Zwischenzähler können beliebig kaskadiert sein. Spezialfälle
				stellen Hybrid-Speicher, Solaredge mit mehreren Wechselrichtern
				sowie bspw. Speicher von Victron mit integriertem Zähler dar.
			</p>
			<p class="font-weight-bold">
				Änderungen werden nur bei klicken auf speichern wirksam
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
