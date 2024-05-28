<template>
	<InstallAssistantStepTemplate
		title="4. Ladepunkt(e) einrichten"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Diese openWB wurde als "secondary" konfiguriert und wird von
				einer anderen openWB ferngesteuert.
			</p>
			<p>
				Bei vorkonfigurierten openWBs ist ab Werk bereits ein (zwei bei
				einer DUO) interner Ladepunkt eingetragen, es müssen keine
				weiteren Ladepunkte hinzugefügt werden.
			</p>
			<p>
				Tragen Sie unter Ladepunkte bei verfügbare Ladepunkte "Interne
				openWB" ein und wählen Sie die Bauart der openWB (z.B. openWB
				series 1/2 custom, Standard (+) oder Buchse) aus.
			</p>
			<p>
				Wenn eine openWB Duo gewählt wurde, können zwei Ladepunkte mit
				Ladepunkt-Nummer 1 und 2 konfiguriert werden. Bei der openWB Pro
				sind keine Einstellungen notwendig.
			</p>
			<p>
				Für den ausgewählten Betrieb als secondary sind keine weiteren
				Einstellungen notwendig.
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
	name: "InstallAssistantStep4",
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
			this.$emit("switchPage", 9);
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
