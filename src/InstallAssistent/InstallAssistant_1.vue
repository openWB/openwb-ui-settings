<template>
	<div>
		<openwb-base-card
			:title="currentPage + 1 + '. ' + pages[currentPage].title"
		>
			<template #footer>
				<div class="row justify-content-center mb-1">
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							class="btn-block btn-warning"
							@buttonClicked="previousPage()"
						>
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'caret-left']"
							/>
							Zurück
						</openwb-base-click-button>
					</div>
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							class="btn-block btn-success"
							@buttonClicked="nextPage()"
						>
							Weiter
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'caret-right']"
							/>
						</openwb-base-click-button>
					</div>
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							class="btn-block btn-danger"
							@buttonClicked="endAssistant()"
						>
							Assistent beenden
						</openwb-base-click-button>
					</div>
				</div>
			</template>
			<div class="row justify-content-center mb-1">
				<div class="page-help-text col-md-3 py-2">
					<p>
						Wir empfehlen an dieser Stelle eine Sicherung der openWB
						zu erzeugen, auf welche man später zurückgreifen könnte,
						insbesondere, wenn die openWB schon konfiguriert war und
						der Assistent nun erneut ausgeführt wird.
					</p>
					<p>
						Dadurch werden gesammelte Daten/Einstellungen gesichert
						und können wieder hergestellt werden.
					</p>
					<p>
						Dazu Warnung akzeptieren, auf Sicherung /
						Wiederherstellung gehen und unter Sicherung auf
						Sicherung erstellen klicken.
					</p>
					<p>
						Es wird empfohlen regelmäßig Sicherungen der Daten zu
						erstellen.
					</p>
					<p>
						Soll der Assistent die openWB komplett neu einrichten,
						kann hier auch unter Zurücksetzen auf Zurücksetzen
						gedrückt werden, wodurch alle Einstellungen, angelegte
						Geräte/Komponenten, Ladepunkte und Fahrzeuge, usw...
						unwiederbringlich gelöscht werden.
					</p>
					<p>Dieser Schritt kann auch übersprungen werden.</p>
				</div>
				<div class="col py-2">
					<DataManagement
						formName="cloudBackupForm"
						:hideReset="true"
						:hideDefaults="true"
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
						@sendCommand="$emit('sendCommand', $event)"
					/>
				</div>
			</div>
		</openwb-base-card>
	</div>
</template>

<script>
import DataManagement from "../views/DataManagement.vue"
import ComponentState from "../components/mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCaretLeft as fasCaretLeft,
	faCaretRight as fasCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


library.add(fasCaretLeft, fasCaretRight);

export default {
	name: "InstallAssistant1",
	mixins: [ComponentState],
	emits: ["save", "reset", "default", "sendCommand"],
	props: [],
	components: {
		FontAwesomeIcon,
		DataManagement,
	},
	data() {
		return {
			currentPage: 1,
			pages: [
				{ title: "Start" },
				{ title: "Datenverwaltung" },
				{ title: "System" },
				{ title: "Allgemein" },
				{ title: "Ladepunkte" },
				{ title: "Geräte und Komponenten" },
				{ title: "Ladepunkte" },
				{ title: "Lastmanagement" },
				{ title: "Fahrzeuge" },
				{ title: "Abgeschlossen" },
			],
		};
	},
	methods: {
		nextPage() {
			window.scrollTo(0, 0);
			this.$router.push('InstallAssistant2');
		},
		previousPage() {
			window.scrollTo(0, 0);
			this.$router.push('InstallAssistant');
		},
		endAssistant() {
			//First time access to InstallWizard if "Assistent beenden" is pressed -> Wizard will not show on Startup anymore!
			if (!this.$store.state.mqtt["openWB/system/installAssistantDone"]) {
				this.updateState("openWB/system/installAssistantDone", true);
				this.$root.doPublish(
					"openWB/set/system/installAssistantDone",
					true,
				);
			}
			this.$router.push("/Status");
		},
	},
};
</script>

<style scoped>
.page-help-text {
	border-right: 1px solid rgba(0, 0, 0, 0.125);
	border-bottom: 1px solid rgba(0, 0, 0, 0.125);
	background-color: rgba(0, 0, 0, 0.03);
}
</style>
