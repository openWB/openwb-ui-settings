<template>
	<div>
		<openwb-base-card
			:title="currentPage + 1 + '. ' + pages[currentPage].title"
		>
			<template #footer>
				<div class="row justify-content-center mb-1">
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							v-if="!hidePrevious"
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
							v-if="!hideNext"
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
							v-if="!hideEnd"
							class="btn-block btn-danger"
							@buttonClicked="endAssistant()"
						>
							Assistent beenden
						</openwb-base-click-button>
					</div>
				</div>
			</template>
			<div v-if="currentPage == 0" class="p-2">
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
					<li>Konfiguration Lastmanagement</li>
					<li>Einrichten der Ladepunkte</li>
					<li>Konfiguration Lastmanagement (optional)</li>
					<li>Einrichten der Fahrzeuge</li>
					<li>Grundkonfiguration abgeschlossen</li>
				</ol>
			</div>
			<div v-if="currentPage !== 0" class="row justify-content-center mb-1">
				<div class="page-help-text col-md-3 py-2">
					<slot name="help">
						<div v-if="currentPage ==1">
							<InstallAssistantPage1 :v-bind="help"/>
						</div>
					</slot>
				</div>
				<div class="col py-2">
					<slot name="pageContent">
						<div v-if="currentPage ==1">
							<InstallAssistantPage1 :v-bind="content"/>
						</div>
					</slot>
				</div>
			</div>
		</openwb-base-card>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCaretLeft as fasCaretLeft,
	faCaretRight as fasCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ComponentStateVue from '../mixins/ComponentState.vue';
import InstallAssistantPage1 from './InstallAssistant_1.vue'

library.add(fasCaretLeft, fasCaretRight);

export default {
	name: "InstallAssistantTemplate",
	mixins: [ComponentStateVue],
	emits: ["previousPage", "nextPage"],
	props: {
		title: {
			type: String,
			required: true,
		},
		hidePrevious: {
			type: Boolean,
			default: false,
		},
		hideNext: {
			type: Boolean,
			default: false,
		},
		hideEnd: {
			type: Boolean,
			default: false,
		},
		currentPage: {
			type: Number,
			required: true,
		}
	},
	components: {
		FontAwesomeIcon,
		InstallAssistantPage1,
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
				{ title: "Lastmanagement" },
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
			this.$emit("nextPage");
			this.currentPage += 1;
		},
		previousPage() {
			window.scrollTo(0, 0);
			this.$emit("previousPage");
			this.currentPage -= 1;
		},
		endAssistant() {
			//First time access to InstallAssistant if "Assistent beenden" pushed-> Assistant will not show on Startup anymore!
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
