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
						Im Lastmanagement werden die maximale Leistung sowie die
						maximalen Ströme für jede Phase des Zählermoduls sowie
						die maximale Ausgangsleistung des Wechselrichters der PV
						Anlage eingetragen, falls eine solche vorhanden ist.
						Unter dem Punkt Vorhandene Zählermodule auf die
						Komponente Zähler klicken und die maximale Leistung des
						Hausanschlusses eintragen.
					</p>
					<p>
						Der erste Zähler ist in der Regel der Zähler am
						EVU-Punkt (also der letzte Punkt im Haus vor dem
						Verbrauchszähler des Energieversorgers) - hier muss die
						maximale Leistung eingetragen werden, die der
						Hausanschluss verträgt und nicht die Anschlussleistung
						der openWB.
					</p>
					<p>
						Ist ein Wechselrichter unter Geräte hinzugefügt worden,
						dann unter dem Punkt Wechselrichter noch die maximale
						Ausgangsleistung des Wechselrichters eintragen, wenn es
						sich um ein Hybrid-System mit DC-Speicher handelt.
					</p>
					<p>
						Nach klicken auf Struktur ist außerdem die Struktur des
						Lastmanagements zu überprüfen und ggf. anzupassen. Im
						Normalfall befinden sich Speicher und Wechselrichter in
						einer Ebene innerhalb des EVU-Zählers. Die Ladepunkte 
						(z.B. Externe openWB, interne openWB,
						Pro, satellit,...) befinden sich auch in derselben
						Ebene wie der Speicher und der Wechselrichter innerhalb
						der Ebene des EVU-Zählers.
					</p>
					<p>
						Zwischenzähler können beliebig kaskadiert sein.
						Spezialfälle stellen Hybrid-Speicher, Solaredge mit
						mehreren Wechselrichtern sowie bspw. Victronspeicher mit
						integriertem Zähler dar.
					</p>
					<p class="font-weight-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="col py-2">
					<LoadManagementConfig
						formName="loadManagementConfigForm"
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
					/>
				</div>
			</div>
		</openwb-base-card>
	</div>
</template>

<script>
import LoadManagementConfig from "../views/LoadManagementConfig.vue";
import ComponentState from "../components/mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCaretLeft as fasCaretLeft,
	faCaretRight as fasCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


library.add(fasCaretLeft, fasCaretRight);

export default {
	name: "InstallAssistant7",
	mixins: [ComponentState],
	emits: ["save", "reset", "default", "sendCommand"],
	props: [],
	components: {
		FontAwesomeIcon,
		LoadManagementConfig,
	},
	data() {
		return {
			currentPage: 7,
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
			this.$router.push('InstallAssistant8');
		},
		previousPage() {
			window.scrollTo(0, 0);
			this.$router.push('InstallAssistant6');
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
