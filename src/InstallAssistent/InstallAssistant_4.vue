<template>
	<div>
		<openwb-base-card
			:title="currentPage + 1 + '. ' + pages[currentPage].title"
			:class="currentPage > 0 && !isLastPage ? 'p-0' : ''"
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
					<!--
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
					-->
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							class="btn-block btn-success"
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
						Diese openWB wurde als "secondary" konfiguriert und wird
						von einer anderen openWB ferngesteuert.
					</p>
					<p>
						Tragen Sie unter Ladepunkte bei verfügbare Ladepunkte
						"Interne openWB" ein und wählen Sie die Bauart der
						openWB (z.B. openWB series 1/2 custom, Standard (+) oder
						Buchse) aus.
					</p>
					<p>
						Wenn eine openWB Duo gewählt wurde, können zwei
						Ladepunkte mit Ladepunkt-Nummer 1 und 2 konfiguriert
						werden. Bei der openWB Pro sind keine Einstellungen
						notwendig.
					</p>
					<p>
						Es sind keine weiteren Einstellungen notwendig. Der
						Assistent kann nach drücken von speichern beendet
						werden. Sollte diese openWB erneut konfiguriert und als
						primary eingesetzt werden, dann muss der angelegte
						Ladepunkt interne openWB vorher entfernt werden.
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
	name: "InstallAssistant4",
	mixins: [ComponentState],
	emits: ["save", "reset", "default", "sendCommand"],
	props: [],
	components: {
		FontAwesomeIcon,
		ChargePointInstallation,
	},
	data() {
		return {
			currentPage: 4,
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
			//this.$router.push('');
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
