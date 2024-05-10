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
							class="btn-block btn-danger"
							@buttonClicked="endAssistant()"
						>
							Assistent beenden
						</openwb-base-click-button>
					</div>
				</div>
			</template>
			<div v-if="currentPage == 0" class="p-2">
				<h2>RFID Einrichtungsassistent</h2>
				<p>
					Dieser Assistent führt Dich durch die Konfiguration der
					einzelnen Module:
				</p>
				<ol>
					<li>Start des Assistenten</li>
					<li>Optionale Hardware - RFID aktivieren</li>
					<li>Ladepunkte konfigurieren</li>
					<li>Fahrzeuge konfigurieren</li>
					<li>Grundkonfiguration abgeschlossen</li>
				</ol>
			</div>
			<div v-if="currentPage ==4">
						<h2>Die Grundkonfiguration ist jetzt abgeschlossen.</h2>
			</div>
			<div v-if="currentPage !== 0 && currentPage < 4" class="row justify-content-center mb-1">
				<div class="page-help-text col-md-3 py-2" >
					<slot >
						<div v-html="helpText[currentPage].text"> </div>
					</slot>
				</div>
				<div class="col py-2">
					<slot name="pageContent">
						<div v-if="currentPage ==1">
							<RFIDAssistant_1
							@save="$emit('save')"
							@reset="$emit('reset')"
							@defaults="$emit('defaults')"
							@sendCommand="$emit('sendCommand', $event)"/>
						</div>
						<div v-if="currentPage ==2 ">
							<RFIDAssistant_2
							@save="$emit('save')"
							@reset="$emit('reset')"
							@defaults="$emit('defaults')"
							@sendCommand="$emit('sendCommand', $event)"/>
						</div>
						<div v-if="currentPage ==3">
							<RFIDAssistant_3
							@save="$emit('save')"
							@reset="$emit('reset')"
							@defaults="$emit('defaults')"
							@sendCommand="$emit('sendCommand', $event)"/>
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
import ComponentStateVue from '../mixins/ComponentState.vue'
import RFIDAssistant_1 from "./RFIDAssistant_1.vue";
import RFIDAssistant_2 from "./RFIDAssistant_2.vue";
import RFIDAssistant_3 from "./RFIDAssistant_3.vue";

library.add(fasCaretLeft, fasCaretRight);

export default {
	name: "RFIDAssistantTemplate",
	mixins: [ComponentStateVue],
	emits: ["save", "reset", "default", "sendCommand"],
	props: {
	},
	components: {
		FontAwesomeIcon,
		RFIDAssistant_1,
		RFIDAssistant_2,
		RFIDAssistant_3,
	},
	data() {
		return {
			currentPage: 0,
			hidePrevious: true,
			hideNext: false,
			pages: [
				{ title: "Start" },
				{ title: "Optionale Hardware" },
				{ title: "Ladepunkte" },
				{ title: "Fahrzeuge" },
				{ title: "Abgeschlossen" },
			],
			helpText: [
				{ text: ""},
				{ text: '<p>Auswahl, dass die Zugangskontrolle aktiv ist.<br /><br />Dadurch lassen sich prinzipiell drei verschiedene Szenarien realisieren.<br />Wird hier die Identifikation aktiviert, und im nächsten Fenster der entsprechende ID-Tag im Ladepunkt-Profil eingetragen, dann kann dadurch dieser Ladepunkt mit diesem Tag entsperrt werden und das zuletzt zugeordnete Fahrzeug startet den Ladevorgang an diesem Ladepunkt.<br /><br />Ist derselbe Tag auch bei einem Fahrzeug hinterlegt, dann wird der Ladepunkt entsperrt und das dem ID-Tag zugeordnete Fahrzeug startet den Ladevorgang mit dem entsprechenden Lade-Profil.<br /><br />Wird die Option Zugangskontrolle - Freigabe durch ID-Tags im Ladepunkt-Profil nicht aktiviert, dann startet das dem ID-Tag zugeordnete Fahrzeug mit entsprechendem Lade-Profil den Ladevorgang, insofern der Ladepunkt nicht gesperrt ist.</p>.<br /><p class="font-weight-bold">Änderungen werden nur bei klicken auf speichern wirksam</p>'},
				{ text: '<p>Unter Ladepunkt-Profile bei einem Ladepunkt-Profil unter dem Punkt Zugangskontrolle kann die Freigabe durch ID-Tags aktiviert werden.<br /><br />Dadurch kann der Ladepunkt in Kombination mit der Option Sperren nach Abstecken oder bei manueller Sperrung nur durch den zugehörigen ID-Tag entsperrt werden.<br /><br />Diese Option nur dann aktivieren, wenn der Ladepunkt tatsächlich nur durch die hier hinterlegten Tags entsperrt werden soll.<br />Diese Option ist vor allem sinnvoll in Kombination mit Sperre nach Abstecken und Standard nach Abstecken im Fahrzeug Lade-Profil.<br /><br />Anschließend ist den Ladepunkten das entsprechende Ladepunkt-Profil unter Ladepunkte zuzuordnen</p>.<br /><p class="font-weight-bold">Änderungen werden nur bei klicken auf speichern wirksam</p>'},
				{ text: '<p>Unter Lade-Profile kann der aktive Lademodus eingestellt werden und die zwei Optionen Sperre nach Abstecken oder Standard nach Abstecken sind auswählbar.<br /><br />Die Option Sperre nach Abstecken ist vor allem dann sinnvoll, wenn im Ladepunkt-Profil die Zugangskontrolle aktiviert ist und dort ein ID-Tag hinterlegt ist, welcher gleichzeitig in einem Fahrzeug eingetragen ist.<br /> Ist dieser Tag dann im entsprechenden Fahrzeug hinterlegt, wird der Ladepunkt entsperrt und das dem ID-Tag zugeordnete Fahrzeug (mit dessen Ladeprofil) geladen wird.<br /><br />Also der im Ladepunkt-Profil und im Fahrzeug hinterlegte ID-Tag sind identisch.<br /><br />Alternativ kann hier auch Standard nach Abstecken ausgewählt werden, wobei dann das Standard-Lade-Profil nach Abstecken ausgewählt wird. Wird im Standard-Lade-Profl bei aktiver Lademodus Stop ausgewählt, wird bei erneutem Anstecken eines Fahrzeugs der Ladevorgang verhindert.<br /><br />Diese Option macht nur Sinn, wenn ein ID-Tag in einem Fahrzeug hinterlegt wird, wodurch dann nach Abscannen des ID-Tags das diesem Fahrzeug zugeordnete Fahrezug mit entsprechendem Lade-Profil ausgewählt wird, welches einen aktiven Lademodus hat, wodurch dann dieses Fahrzeug den Ladevorgang startet.<br /><br />Bei Auswahl Standard nach Abstecken macht es keinen Sinn im Ladepunkt-Profil die Zugangskontrolle zu aktivieren und einen ID-Tag einzutragen.</p>.<br /><p class="font-weight-bold">Änderungen werden nur bei klicken auf speichern wirksam</p>' },			
				{ tex: ''},
			],
		};
	},
	methods: 
	{
		nextPage() {
			window.scrollTo(0, 0);
			this.currentPage += 1;
			this.hidePrevious = false;
			if(this.currentPage == 4){
				this.hideNext = true;
				}
		},
		previousPage() {
			window.scrollTo(0, 0);
			this.hideNext = false;
			this.currentPage -= 1;
			if(this.currentPage == 0){
				this.hidePrevious = true;
			}
		},
		endAssistant() {
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
