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
						Zuerst Fahrzeug-Profile und Lade-Profile konfigurieren.
						In den meisten Fällen reicht das
						Standard-Fahrzeug-Profil aus, vor allem wenn alle Autos
						mit dem gleichen Lademodus geladen werden oder eigene
						Profile definieren.
					</p>
					<p>
						Für jedes Modell eine Vorlage auswählen und die
						Einstellungen Mindeststromstärke, Maximalstromstärke bei
						einer/mehreren Phase/n sowie Angaben zur Batterie und
						Handhabung der Phasen entsprechend den Daten des
						Automobilherstellers eintragen. Im Zweifelsfall den
						Hersteller des Autos fragen.
					</p>
					<p>
						In den meisten Fällen sind die Einstellungen im
						Standard-Lade-Profil für sofortiges Laden ausreichend,
						eventuell Soll-Ladestrom anpassen. Ansonsten ein eigenes
						Lade-Profil anlegen. Dann Fahrzeug anlegen und
						Fahrzeug-Profil und Ladeprofil dem entsprechenden
						Fahrzeug zuordnen.
					</p>
					<p>
						Sind am Standort mehrere Fahrzeuge vorhanden und sollen
						diese in unterschiedlichen Modi geladen werden (z.B.
						eines mit PV- Überschuss und eines mit Modus
						Sofortladen), dann ist für jedes Fahrzeug ein eigenes
						Lade-Profil anzulegen.
					</p>
					<p class="font-weight-bold">
						Wichtig: Die Phasigkeit des Fahrzeugs ist richtig
						einzutragen!
					</p>
					<p>
						Kennt man die Phasigkeit des Fahrzeugs nicht (z.B.
						Besucherfahrzeug) besser ein Besucherfahrzeugprofil
						anlegen, welches die Phasenumschaltung unterdrückt.
					</p>
					<p class="font-weight-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="col py-2">
					<!--VehicleConfig formName="vehicleConfigForm"-->
					<VehicleConfig
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
import VehicleConfig from "../views/VehicleConfig.vue";
import ComponentState from "../components/mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCaretLeft as fasCaretLeft,
	faCaretRight as fasCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


library.add(fasCaretLeft, fasCaretRight);

export default {
	name: "InstallAssistant",
	mixins: [ComponentState],
	emits: ["save", "reset", "default", "sendCommand"],
	props: [],
	components: {
		FontAwesomeIcon,
		VehicleConfig,
	},
	data() {
		return {
			currentPage: 8,
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
			this.$router.push('InstallAssistant9');
		},
		previousPage() {
			window.scrollTo(0, 0);
			this.$router.push('InstallAssistant7');
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
