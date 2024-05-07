<template>
	<div>
		<openwb-base-card
			:title="(currentPage + 1) + '. ' + pages[currentPage].title"
			:class="currentPage > 0 && !isLastPage ? 'p-0' : ''"
		>
			<template #footer>
				<div class="row justify-content-center mb-1">
					<!-- 
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							v-if="currentPage > 0"
							class="btn-block btn-warning"
							@buttonClicked="previousPage()"
						>
							<font-awesome-icon fixed-width :icon="['fas', 'caret-left']" />
							Zurück
						</openwb-base-click-button>
					</div>
					-->
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							v-if="!isLastPage"
							class="btn-block btn-success"
							@buttonClicked="nextPage()"
						>
							Weiter
							<font-awesome-icon fixed-width :icon="['fas', 'caret-right']" />
						</openwb-base-click-button>
					</div>
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							:class="'btn-block btn-' + (isLastPage ? 'success' : 'danger')"
							@buttonClicked="endAssistant()"
						>
							Assistent beenden
						</openwb-base-click-button>
					</div>
				</div>
			</template>
			<div v-if="currentPage == 0" class="p-2">
				<h2>
					Vielen Dank, dass Du Dich für openWB entschieden hast.
				</h2>
				<p>
					Dieser Assistent führt Dich durch die Konfiguration der einzelnen
					Module:
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
					<li>Sicherung der Erstkonfiguration</li>
				</ol>
			</div>
			<div v-if="currentPage == 1" class="row m-0">
				<div class="page-help-text col-md-3 py-2">
					<p>
						Sicherung erzeugen wenn der Assistent erneut ausgeführt
						wird und die openWB bereits im Einsatz war.
					</p>
					<p>
						Dadurch werden gesammelte Daten/Einstellungen gesichert
						und können wieder hergestellt werden.
					</p>
					<p>
						Es wird empfohlen regelmäßige Sicherungen der Daten zu
						erstellen.
					</p>
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

			<div v-if="currentPage == 2" class="row m-0">
				<div class="page-help-text col-md-3 py-2">
					<p>
						Ein System Update durchführen um die Software auf den
						neuesten Stand zu bringen.
					</p>
					<p>
						Das garantiert, dass die openWB mit den neuesten
						Features und Funktionen ausgestattet ist.
					</p>
				</div>
				<div class="col py-2">
					<System @sendCommand="$emit('sendCommand', $event)" />
				</div>
			</div>

			<div v-if="currentPage == 3" class="row m-0">
				<div class="page-help-text col-md-3 py-2">
					<p>
						Hier wird abgefragt, ob ihr System mit mehreren openWBs
						oder nur mit einer openWB betrieben wird. Eine openWB
						kann andere openWBs steuern, wobei für jeden Ladepunkt
						eine openWB benötigt wird.
					</p>
					<p>
						Eine openWB standalone hat keinen Ladepunkt (nur
						primary). Eine openWB Standard(+), custom, Duo und
						Buchse können als primary oder secondary betrieben
						werden. Eine openWB Pro und Satellit können nur als
						secondary (als ein Ladepunkt) angeschlossen werden.Eine
						openWB Duo kann zwei Ladepunkte bedienen.
					</p>
					<p>
						Die Steuerung über Modbus dient zur Fernsteuerung über
						ein Nicht- openWB-System und sollte nicht gewählt
						werden, wenn Sie nur openWBs besitzen und die
						openWB-Software zur Steuerung nutzen wollen.
					</p>
					<p class="font-weight-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="col py-2">
					<GeneralConfig
						formName="generalConfigForm"
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
					/>
				</div>
			</div>

			<div v-if="currentPage == 4" class="row m-0">
				<div class="page-help-text col-md-3 py-2">
					<p>
						Diese openWB wurde als "secondary" konfiguriert und wird
						von einer anderen openWB ferngesteuert.
					</p>
					<p>
						Tragen Sie in Ladepunkte Interne openWB ein und wählen
						Sie die Bauart der openWB (z.B. openWB series 1/2
						custom, Standard (+) oder Buchse) aus.
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
						werden.
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

			<div v-if="currentPage == 5" class="row m-0">
				<div class="page-help-text col-md-3 py-2">
					<p>
						Diese openWB wurde als "primary" konfiguriert und
						übernimmt die Steuerung anderer openWBs, falls vorhanden
						sowie die alleinige Regelung des Systems. Dazu müssen im
						Folgenden die Geräte und Komponenten eingerichtet
						werden.
					</p>
					<p>Zuerst wird der EVU-Zähler eingerichtet.</p>
					<p>
						Für jedes verfügbare Gerät eine IP-Adresse vergeben und
						für jedes verfügbare Gerät auch Zähler, Wechselrichter
						und falls vorhanden Speicher hinzufügen.
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
			<div v-if="currentPage == 6" class="row m-0">
				<div class="page-help-text col-md-3 py-2">
					<p>
						Enthält die steuernde openWB Ladetechnik wird bei
						verfügbarer Ladepunkt "Interne openWB" ausgewählt.
						Ansonsten wird "Externe openWB" und Bauart (der
						secondary openWB) ausgewählt und die IP-Adresse der
						anderen openWB (secondary openWB) und Ladepunkt-Nummer
						eingetragen. Bei der openWB Duo als secondary openWB
						sind zwei Ladepunkte mit der Nummer 1 und 2
						hinzuzufügen.
					</p>
					<p>
						Als weitere Hardware-Optionen können Phasenumschaltung,
						Control-Pilot-Unterbrechung, Anzahl angeschlossener
						Phasen sowie Phase 1 des Ladekabels konfiguriert werden.
						Jede openWB mit Phasenumschaltung kann auch
						Control-Pilot-Unterbrechung, wobei bei openWBs ohne
						Phasenumschaltung ist diese Option aufrüstbar. Bei
						mehreren openWBs ist es sinnvoll die Ladepunkte auf
						unterschiedliche Phasen aufzuteilen.
					</p>
					<p>
						Die Phase der Wallbox-Zuleitung muss korrekt ausgewählt
						werden, sonst ist eine Überlastung möglich, wenn bei
						einphasiger Ladung alle Ladepunkte auf derselben Phase
						liegen und gleichzeitig Strom ziehen.
					</p>
					<p>
						Im Menü Ladepunkt-Profile können Eintragungen bzgl. des
						Maximalstroms bei einer Phase bzw. mehreren Phasen
						vorgenommen werden sowie eine automatische Sperre
						eingerichtet und Zeitpläne dafür angelegt werden.
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
			<div v-if="currentPage == 7" class="row m-0">
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

			<div v-if="currentPage == 8" class="row m-0">
				<div class="page-help-text col-md-3 py-2">
					<p>
						Zuerst Fahrzeug-Profile und Lade- Profile konfigurieren.
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
						Standard-Lade- Profil für sofortiges Laden ausreichend,
						eventuell Soll- Ladestrom anpassen. Ansonsten ein
						eigenes Lade-Profil anlegen. Dann Fahrzeug anlegen und
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

			<div v-if="currentPage == 10" class="row m-0">
				<div class="page-help-text col-md-3 py-2">
					<p>
						Zum Schluss eine Sicherung der vorgenommenen
						Konfiguration anfertigen, falls gewünscht.
					</p>
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

			<div v-if="isLastPage">
				<h2>
					Die Grundkonfiguration ist jetzt abgeschlossen.
				</h2>
				<p>
					Bitte überprüfe die Ergebnisse im Status und
					passe bei Unstimmigkeiten die Einstellungen an.
				</p>
			</div>

		</openwb-base-card>
	</div>
</template>

<script>
import DataManagement from "./DataManagement.vue";
import System from "./System.vue";
import GeneralConfig from "./GeneralConfig.vue";
import ChargePointInstallation from "./ChargePointInstallation.vue";
import HardwareInstallation from "./HardwareInstallation.vue";
import LoadManagementConfig from "./LoadManagementConfig.vue";
import VehicleConfig from "./VehicleConfig.vue";
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
		DataManagement,
		System,
		GeneralConfig,
		ChargePointInstallation,
		HardwareInstallation,
		LoadManagementConfig,
		VehicleConfig,
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
				{ title: "Datenverwaltung" },
				{ title: "Abgeschlossen" },
			],
		};
	},
	computed: {
		isLastPage() {
			return this.currentPage == this.pages.length - 1;
		},
	},
	methods: {
		nextPage() {
			if (!this.isLastPage) {
				this.currentPage++;
				window.scrollTo(0, 0);
			} else {
				console.warn("currentPage is already at lastPage");
			}
		},
		previousPage() {
			if (this.currentPage > 0) {
				this.currentPage--;
				window.scrollTo(0, 0);
			} else {
				console.warn("currentPage is already at 0");
			}
		},
		endAssistant() {
			//First time access to InstallWizard if "Assistent beenden" is pressed -> Wizard will not show on Startup anymore!
			if (!this.$store.state.mqtt["openWB/system/installAssistantDone"]) {
				this.updateState("openWB/system/installAssistantDone", true);
				this.$root.doPublish("openWB/set/system/installAssistantDone", true);
			}
			this.$router.push("/Status");
		},
	},
};
</script>

<style scoped>
.page-help-text {
	border-right: 1px solid rgba(0,0,0,.125);
	border-bottom: 1px solid rgba(0,0,0,.125);
	background-color: rgba(0, 0, 0, 0.03);
}
</style>
