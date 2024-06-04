<template>
	<InstallAssistantStepTemplate
		title="2. Aktualisierung des Systems"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Bitte ein System-Update durchführen, um die Software auf den neusten Stand zu bringen.
			</p>
			<p>
				Das garantiert, dass die openWB mit den neuesten Features und
				Funktionen ausgestattet ist.
			</p>
			<p>
				Auf Versions-Informationen / Aktualisierung gehen, Informationen
				aktualisieren und falls ein Update verfügbar ist, wird der
				Update button grün und kann gedrückt werden.
			</p>
			<p>Dieser Schritt kann auch übersprungen werden.</p>
		</template>
		<template v-slot:content>
			<SystemView
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
import SystemView from "../../views/System.vue";

export default {
	name: "InstallAssistantStep2",
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
		SystemView,
	},
	data: () => ({
		mqttTopicsToSubscribe: [],
	}),
	methods: {
		nextPage() {
			this.$emit("switchPage", 3);
		},
		previousPage() {
			this.$emit("switchPage", 1);
		},
		endAssistant() {
			this.$emit("endAssistant");
		},
	},
};
</script>