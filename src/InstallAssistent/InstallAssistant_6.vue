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
						Enthält die steuernde openWB Ladetechnik wird bei
						Ladepunkte unter verfügbare Ladepunkte "Interne openWB"
						ausgewählt. Ansonsten wird "Externe openWB" und Bauart
						(der secondary openWB) ausgewählt und die IP-Adresse der
						anderen openWB (secondary openWB) und die
						Ladepunkt-Nummer eingetragen. Bei der openWB Duo als
						secondary openWB können zwei Ladepunkte mit der Nummer 1
						und 2 hinzugefügt werden.
					</p>
					<p>
						Bei vorkonfigurierten openWBs kann ab Werk hier bereits
						ein Ladepunkt eingetragen sein.
					</p>
					<p>
						Als weitere Hardware-Optionen können Phasenumschaltung,
						Control-Pilot-Unterbrechung, Anzahl angeschlossener
						Phasen sowie Phase 1 des Ladekabels konfiguriert werden.
						Jede openWB mit Phasenumschaltung kann auch
						Control-Pilot-Unterbrechung, wobei bei openWBs ohne
						Phasenumschaltung diese Option aufrüstbar ist. Bei
						mehreren openWBs ist es sinnvoll die Ladepunkte auf
						unterschiedliche Phasen aufzuteilen.
					</p>
					<p>
						Unter Elektrischer Anschluss Phase 1 des Ladekabels muss
						die Phase der Wallbox-Zuleitung korrekt ausgewählt
						werden, sonst ist eine Überlastung möglich, wenn bei
						einphasiger Ladung alle Ladepunkte auf derselben Phase
						liegen und gleichzeitig Strom ziehen. Bitte lesen Sie
						dazu auch die Hinweistexte im rechten Fenster, welche
						durch klicken auf das umrundete Fragezeichensymbol
						hinter den Menüpunkten aufgerufen werden können.
					</p>
					<p>
						Im Menü Ladepunkt-Profile ein Standard Ladepunkt-Profil
						hinzufügen und die Eintragungen bzgl. des Maximalstroms
						bei einer Phase bzw. mehreren Phasen vornehmen sowie -
						falls erwünscht - eine automatische Sperre mit
						Zeitplänen einrichten.
					</p>
					<p class="font-weight-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="col py-2">
					<!--ChargePointInstallation formName="chargePointInstallationForm"-->
					<ChargePointInstallation
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
import ChargePointInstallation from "../views/ChargePointInstallation.vue";
import ComponentState from "../components/mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCaretLeft as fasCaretLeft,
	faCaretRight as fasCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


library.add(fasCaretLeft, fasCaretRight);

export default {
	name: "InstallAssistant6",
	mixins: [ComponentState],
	emits: ["save", "reset", "default", "sendCommand"],
	props: [],
	components: {
		FontAwesomeIcon,
		ChargePointInstallation,
	},
	data() {
		return {
			currentPage: 6,
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
			this.$router.push('InstallAssistant7');
		},
		previousPage() {
			window.scrollTo(0, 0);
			this.$router.push('InstallAssistant5');
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
