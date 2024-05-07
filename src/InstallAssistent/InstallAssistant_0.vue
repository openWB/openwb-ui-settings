<template>
	<div>
		<openwb-base-card
			:title="currentPage + 1 + '. ' + pages[currentPage].title"
			:class="currentPage > 0 && !isLastPage ? 'p-0' : ''"
		>
			<template #footer>
				<div class="row justify-content-center mb-1">
				<!--
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
				-->
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
			
				<h2>Vielen Dank, dass Du Dich für openWB entschieden hast.</h2>
				<p>
					Dieser Assistent führt Dich durch die Konfiguration der
					einzelnen Module:
				</p>
				<ol>
					<li>Start des Assistenten</li>
					<li>Datenverwaltung (optional)</li>
					<li>Update des Systems (optional)</li>
					<li>
						Auswahl primary / secondary openWB - Allgemeine
						Einstellungen
					</li>
					<li>Ladepunkte konfigurieren für openWB als secondary</li>
					<li>
						Einrichten der Geräte und Komponenten für openWB als
						primary
					</li>
					<li>Einrichten der Ladepunkte</li>
					<li>Konfiguration Lastmanagement</li>
					<li>Einrichten der Fahrzeuge</li>
					<li>Grundkonfiguration abgeschlossen</li>
				</ol>
			</openwb-base-card>
		</div>
</template>

<script>
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
	},
	data() {
		return {
			currentPage: 0,
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
			this.$router.push("/System/InstallAssistant1");
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
