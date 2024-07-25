<template>
	<InstallAssistantStepTemplate
		title="1. Datensicherung der bestehenden Konfiguration"
		@nextPage="nextPage"
		@previousPage="previousPage"
		@endAssistant="endAssistant"
	>
		<template v-slot:help>
			<p>
				Wir empfehlen an dieser Stelle eine Sicherung der openWB zu
				erstellen, auf welche später zurückgegriffen werden kann,
				insbesondere, wenn die openWB schon konfiguriert war und der
				Assistent nun erneut ausgeführt wird.
			</p>
			<p>
				Nachdem die Sicherung abgeschlossen ist, kann die erstellte
				Datei über den Link in der Benachrichtigung oder
				<a href="/openWB/data/backup/" target="_blank">hier</a>
				heruntergeladen werden.Beim Herunterladen bitte darauf achten,
				dass die Datei mit der Endung .tar.gz gespeichert wird. Ggf. ist
				das automatische Entpacken des Browsers zu deaktivieren.
			</p>
			<p>
				Es wird empfohlen, regelmäßig Sicherungen der Daten zu
				erstellen.
			</p>
		</template>
		<template v-slot:content>
			<div class="system">
				<openwb-base-alert
					v-if="!installAssistantActive"
					subtype="danger"
				>
					<h2>Achtung!</h2>
					<p>
						Bevor der Assistent gestartet wird, ist sicherzustellen,
						dass kein Ladevorgang aktiv ist! Zur Sicherheit bitte
						zusätzlich alle Fahrzeuge von der Ladestation / den
						Ladestationen abstecken!
					</p>
					<openwb-base-button-group-input
						title="Ich habe die Warnung verstanden"
						:buttons="[
							{
								buttonValue: false,
								text: 'Nein',
								class: 'btn-outline-danger',
							},
							{
								buttonValue: true,
								text: 'Ja',
								class: 'btn-outline-success',
							},
						]"
						v-model="this.warningAcknowledged"
					/>
				</openwb-base-alert>
			</div>
			<DataManagement
				v-if="warningAcknowledged"
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
import DataManagement from "../../views/DataManagement.vue";

export default {
	name: "InstallAssistantStep1",
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
		DataManagement,
	},
	data: () => ({
		mqttTopicsToSubscribe: [],
		warningAcknowledged: false,
	}),
	methods: {
		nextPage() {
			this.$emit("switchPage", 2);
		},
		previousPage() {
			this.$emit("switchPage", 0);
		},
		endAssistant() {
			this.$emit("endAssistant");
		},
	},
};
</script>
