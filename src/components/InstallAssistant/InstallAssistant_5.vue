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
						Diese openWB wurde als "primary" konfiguriert und
						übernimmt die Steuerung anderer openWBs, falls vorhanden
						sowie die alleinige Regelung des Systems. Dazu müssen im
						Folgenden die Geräte und Komponenten eingerichtet
						werden.
					</p>
					<p>
						Ab Werkseinstellung kann hier bereits ein virtueller
						Zähler vorkonfiguriert sein, welcher gelöscht werden
						kann, sobald korrekte EVU-Daten übertragen werden.
					</p>
					<p>
						Bei verfügbare Geräte das entsprechenden Gerät auswählen
						und hinzufügen. Danach auf das neue Gerät klicken und
						für jedes verfügbare Gerät falls nötig eine IP-Adresse
						oder Hostname, Benutzername und Passwort oder Server-URL
						eintragen. Dann unter Verfügbare Komponenten falls
						vorhanden Zähler, Wechselrichter und Speicher
						hinzufügen.
					</p>
					<p>
						Hier ein PV-Kit auszuwählen dient nur der Visualisierung
						in openWB, denn die PV wird automatisch mitgerechnet,
						wenn die openWB an den EVU-Zähler angeschlossen ist.
					</p>
					<p class="font-weight-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="col py-2">
					<!--HardwareInstallation formName="hardwareInstallationForm"-->
					<HardwareInstallation
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
import HardwareInstallation from "../views/HardwareInstallation.vue";
import ComponentState from "../components/mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCaretLeft as fasCaretLeft,
	faCaretRight as fasCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


library.add(fasCaretLeft, fasCaretRight);

export default {
	name: "InstallAssistant5",
	mixins: [ComponentState],
	emits: ["save", "reset", "default", "sendCommand"],
	props: [],
	components: {
		FontAwesomeIcon,
		HardwareInstallation,
	},
	data() {
		return {
			currentPage: 5,
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
			this.$router.push('InstallAssistant6');
		},
		previousPage() {
			window.scrollTo(0, 0);
			this.$router.push('InstallAssistant3');
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
