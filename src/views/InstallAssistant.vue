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
					<li>Ladepunkte einrichten falls openWB als secondary konfiguriert</li>
					<li>
						Einrichten der Geräte und Komponenten für openWB als
						primary
					</li>
					<li>Einrichten der Ladepunkte</li>
					<li>Konfiguration Lastmanagement</li>
					<li>Einrichten der Fahrzeuge</li>
					<li>Grundkonfiguration abgeschlossen</li>
				</ol>
			</div>
			<div v-if="currentPage ==9">
						<h2>Die Grundkonfiguration ist jetzt abgeschlossen.</h2>
						<p>Bitte überprüfe die Ergebnisse im Status und passe bei Unstimmigkeiten die Einstellungen an.</p>
						<p>Weitere Optionen und Einstellungen sind auf den System- und Konfigurationsseiten einsehbar.</p>
					</div>
			<div v-if="currentPage !== 0 && currentPage < 9" class="row justify-content-center mb-1">
				<div class="page-help-text col-md-3 py-2" >
					<slot >
						<div v-html="helpText[currentPage].text"> </div>
					</slot>
				</div>
				<div class="col py-2">
					<slot name="pageContent">
						<div v-if="currentPage ==1">
							<DataManagement :installAssistantActive="this.installAssistantActive" :normalMode="this.normalMode"
							@save="$emit('save')"
							@reset="$emit('reset')"
							@defaults="$emit('defaults')"
							@sendCommand="$emit('sendCommand', $event)"/>
						</div>
						<div v-if="currentPage ==2 ">
							<System :installAssistantActive="this.installAssistantActive" :normalMode="this.normalMode"
							@sendCommand="$emit('sendCommand', $event)"/>
						</div>
						<div v-if="currentPage ==3">
							<GeneralConfig :installAssistantActive="this.installAssistantActive" :normalMode="this.normalMode"
							@save="$emit('save')"
							@reset="$emit('reset')"
							@defaults="$emit('defaults')"
							@sendCommand="$emit('sendCommand', $event)"/>
						</div>
						<div v-if="currentPage ==4">
							<ChargePointInstallation :installAssistantActive="this.installAssistantActive" :normalMode="this.normalMode"
							@save="$emit('save')"
							@reset="$emit('reset')"
							@defaults="$emit('defaults')"
							@sendCommand="$emit('sendCommand', $event)"/>
						</div>
						<div v-if="currentPage ==5">
							<HardwareInstallation :installAssistantActive="this.installAssistantActive" :normalMode="this.normalMode"
							@save="$emit('save')"
							@reset="$emit('reset')"
							@defaults="$emit('defaults')"
							@sendCommand="$emit('sendCommand', $event)"/>
						</div>
						<div v-if="currentPage ==6">
							<ChargePointInstallation :installAssistantActive="this.installAssistantActive" :normalMode="this.normalMode"
							@save="$emit('save')"
							@reset="$emit('reset')"
							@defaults="$emit('defaults')"
							@sendCommand="$emit('sendCommand', $event)"/>
						</div>
						<div v-if="currentPage ==7">
							<LoadManagementConfig :installAssistantActive="this.installAssistantActive" :normalMode="this.normalMode"
							@save="$emit('save')"
							@reset="$emit('reset')"
							@defaults="$emit('defaults')"
							@sendCommand="$emit('sendCommand', $event)"/>
						</div>
						<div v-if="currentPage ==8">
							<VehicleConfig :installAssistantActive="this.installAssistantActive" :normalMode="this.normalMode"
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

import DataManagement from "./DataManagement.vue";
import System from "./System.vue";
import GeneralConfig from "./GeneralConfig.vue";
import ChargePointInstallation from "./ChargePointInstallation.vue";
import HardwareInstallation from "./HardwareInstallation.vue";
import LoadManagementConfig from "./LoadManagementConfig.vue";
import VehicleConfig from "./VehicleConfig.vue";
import ComponentState from "../components/mixins/ComponentState.vue";

library.add(fasCaretLeft, fasCaretRight);

export default {
	name: "InstallAssistant",
	mixins: [ComponentState],
	emits: ["save", "reset", "default", "sendCommand"],
	props: {
	},
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
			prevent_err: 0,
			installAssistantActive: false,
			normalMode: true,
			hidePrevious: true,
			hideNext: false,
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
			helpText: [
				{ text: ""},
				{ text: '<p>Wir empfehlen an dieser Stelle eine Sicherung der openWB zu erzeugen, auf welche man später zurückgreifen könnte, insbesondere, wenn die openWB schon konfiguriert war und der Assistent nun erneut ausgeführt wird.</p><p>Dadurch werden gesammelte Daten/Einstellungen gesichert und können wieder hergestellt werden.</p><p>Dazu Warnung akzeptieren, auf Sicherung / Wiederherstellung gehen und unter Sicherung auf Sicherung erstellen klicken.</p><p>Es wird empfohlen regelmäßig Sicherungen der Daten zu erstellen.</p><p>Soll der Assistent die openWB komplett neu einrichten, dann außerhalb des Assistenten unter System -> Datenverwaltung den Punkt Zurücksetzen anwählen.</p><p>Dieser Schritt kann auch übersprungen werden.</p>'},
				{ text: '<p>Ein System Update durchführen um die Software auf den neuesten Stand zu bringen.</p><p>Das garantiert, dass die openWB mit den neuesten Features und Funktionen ausgestattet ist.</p><p>Auf Versions-Informationen / Aktualisierung gehen, Informationen aktualisieren und falls ein Update verfügbar ist, wird der Update button grün und kann bei Bedarf gedrückt werden.</p><p>Dieser Schritt kann auch übersprungen werden.</p>'},
				{ text: '<p>Hier wird abgefragt, ob ihr System mit mehreren openWBs oder nur mit einer openWB betrieben wird. Eine openWB kann andere openWBs steuern, wobei für jeden Ladepunkt eine openWB benötigt wird.</p><p>Hierzu das Feld Steuerungsmodus (primary oder secondary) auswählen.</p><p>Eine openWB standalone hat keinen Ladepunkt (nur primary). Eine openWB Standard(+), custom, Duo und Buchse können als primary oder secondary betrieben werden. Eine openWB Pro und Satellit können nur als secondary (als ein Ladepunkt) angeschlossen werden. Eine openWB Duo kann zwei Ladepunkte bedienen.</p>' },			
				{ text: '<p>Diese openWB wurde als "secondary" konfiguriert und wird von einer anderen openWB ferngesteuert.</p><p>Tragen Sie unter Ladepunkte bei verfügbare Ladepunkte "Interne openWB" ein und wählen Sie die Bauart der openWB (z.B. openWB series 1/2 custom, Standard (+) oder Buchse) aus.</p><p>Wenn eine openWB Duo gewählt wurde, können zwei Ladepunkte mit Ladepunkt-Nummer 1 und 2 konfiguriert werden. Bei der openWB Pro sind keine Einstellungen notwendig.</p><p>Es sind keine weiteren Einstellungen notwendig. Der Assistent kann nach drücken von speichern beendet werden. Sollte diese openWB erneut konfiguriert und als primary eingesetzt werden, dann muss der angelegte Ladepunkt interne openWB vorher entfernt werden.</p><p class="font-weight-bold">Änderungen werden nur bei klicken auf speichern wirksam</p>'},
				{ text: '<p>Diese openWB wurde als "primary" konfiguriert und übernimmt die Steuerung anderer openWBs, falls vorhanden sowie die alleinige Regelung des Systems. Dazu müssen im Folgenden die Geräte und Komponenten eingerichtet werden.</p><p>Ab Werkseinstellung kann hier bereits ein virtueller Zähler vorkonfiguriert sein, welcher gelöscht werden kann, sobald korrekte EVU-Daten übertragen werden.</p><p>Bei verfügbare Geräte das entsprechenden Gerät auswählen und hinzufügen. Danach auf das neue Gerät klicken und für jedes verfügbare Gerät falls nötig eine IP-Adresse oder Hostname, Benutzername und Passwort oder Server-URL eintragen. Dann unter Verfügbare Komponenten falls vorhanden Zähler, Wechselrichter und Speicher hinzufügen.</p><p>Hier ein PV-Kit auszuwählen dient nur der Visualisierung in openWB, denn die PV wird automatisch mitgerechnet, wenn die openWB an den EVU-Zähler angeschlossen ist.</p><p class="font-weight-bold">Änderungen werden nur bei klicken auf speichern wirksam</p>'},
				{ text: '<p>Enthält die steuernde openWB Ladetechnik wird bei Ladepunkte unter verfügbare Ladepunkte "Interne openWB" ausgewählt. Ansonsten wird "Externe openWB" und Bauart (der secondary openWB) ausgewählt und die IP-Adresse der anderen openWB (secondary openWB) und die Ladepunkt-Nummer eingetragen. Bei der openWB Duo als secondary openWB können zwei Ladepunkte mit der Nummer 1 und 2 hinzugefügt werden.</p><p>Bei vorkonfigurierten openWBs kann ab Werk hier bereits ein Ladepunkt eingetragen sein.</p><p>Unter Elektrischer Anschluss Phase 1 des Ladekabels muss die Phase der Wallbox-Zuleitung korrekt ausgewählt werden, sonst ist eine Überlastung möglich, wenn bei einphasiger Ladung alle Ladepunkte auf derselben Phase liegen und gleichzeitig Strom ziehen.<p>Bei mehreren openWBs ist es sinnvoll die Ladepunkte auf unterschiedliche Phasen aufzuteilen.</p>Bitte lesen Sie dazu auch die Hinweistexte im rechten Fenster, welche durch klicken auf das umrundete Fragezeichensymbol hinter den Menüpunkten aufgerufen werden können.</p><p class="font-weight-bold">Änderungen werden nur bei klicken auf speichern wirksam</p>'},
				{ text: '<p>Im Lastmanagement werden die maximale Leistung sowie die maximalen Ströme für jede Phase des Zählermoduls sowie die maximale Ausgangsleistung des Wechselrichters der PV Anlage eingetragen, falls eine solche vorhanden ist. Unter dem Punkt Vorhandene Zählermodule auf die Komponente Zähler klicken und die maximale Leistung des Hausanschlusses eintragen.</p><p>Der erste Zähler ist in der Regel der Zähler am EVU-Punkt (also der letzte Punkt im Haus vor dem Verbrauchszähler des Energieversorgers) - hier muss die maximale Leistung eingetragen werden, die der Hausanschluss verträgt und nicht die Anschlussleistung der openWB.</p><p>Ist ein Wechselrichter unter Geräte hinzugefügt worden, dann unter dem Punkt Wechselrichter noch die maximale Ausgangsleistung des Wechselrichters eintragen, wenn es sich um ein Hybrid-System mit DC-Speicher handelt.</p><p>Nach klicken auf Struktur ist außerdem die Struktur des Lastmanagements zu überprüfen und ggf. anzupassen. Im Normalfall befinden sich Speicher und Wechselrichter in einer Ebene innerhalb des EVU-Zählers. Die Ladepunkte (z.B. Externe openWB, interne openWB, Pro, satellit,...) befinden sich auch in derselben Ebene wie der Speicher und der Wechselrichter innerhalb der Ebene des EVU-Zählers.</p><p>Zwischenzähler können beliebig kaskadiert sein. Spezialfälle stellen Hybrid-Speicher, Solaredge mit mehreren Wechselrichtern sowie bspw. Victronspeicher mit integriertem Zähler dar.</p><p class="font-weight-bold">Änderungen werden nur bei klicken auf speichern wirksam</p>'},
				{ text: '<p>Zuerst Fahrzeug-Profile und Lade-Profile konfigurieren. In den meisten Fällen reicht das Standard-Fahrzeug-Profil aus, vor allem wenn alle Autos mit dem gleichen Lademodus geladen werden oder eigene Profile definieren.</p><p>Für jedes Modell eine Vorlage auswählen und die Einstellungen Mindeststromstärke, Maximalstromstärke bei einer/mehreren Phase/n sowie Angaben zur Batterie und Handhabung der Phasen entsprechend den Daten des Automobilherstellers eintragen. Im Zweifelsfall den Hersteller des Autos fragen.</p><p>In den meisten Fällen sind die Einstellungen im Standard-Lade-Profil für sofortiges Laden ausreichend, eventuell Soll-Ladestrom anpassen. Ansonsten ein eigenes Lade-Profil anlegen. Dann Fahrzeug anlegen und Fahrzeug-Profil und Ladeprofil dem entsprechenden Fahrzeug zuordnen.</p><p>Sind am Standort mehrere Fahrzeuge vorhanden und sollen diese in unterschiedlichen Modi geladen werden (z.B. eines mit PV- Überschuss und eines mit Modus Sofortladen), dann ist für jedes Fahrzeug ein eigenes Lade-Profil anzulegen.</p><p class="font-weight-bold">Wichtig: Die Phasigkeit des Fahrzeugs ist richtig einzutragen!</p><p>Kennt man die Phasigkeit des Fahrzeugs nicht (z.B. Besucherfahrzeug) besser ein Besucherfahrzeugprofil anlegen, welches die Phasenumschaltung unterdrückt.</p><p class="font-weight-bold">Änderungen werden nur bei klicken auf speichern wirksam</p>'},
				{ tex: ''},
			],
		};
	},
	methods: {
		nextPage() {
			window.scrollTo(0, 0);
			if(!this.installAssistantActive){
				this.installAssistantActive = true;
				this.normalMode = false;
			}
			this.currentPage += 1;
			this.hidePrevious = false;
			if(this.currentpage == 3 || this.currentPage == 4){
				this.$emit("save");
			}
			if(this.currentPage == 4 && this.$store.state.mqtt["openWB/general/extern"] == true || this.currentPage == 9){
				this.hideNext = true;
			}
			if (
				this.$store.state.mqtt["openWB/general/extern"] != true &&this.currentPage == 4
				) {
				this.currentPage = 5;
			}
		},
		previousPage() {
			window.scrollTo(0, 0);
			this.prevent_err = this.currentPage;
			this.hideNext = false;
			this.currentPage -= 1;
			if(this.currentPage == 0){
				this.hidePrevious = true;
			}
			if (this.currentPage == 4 && this.prevent_err == 5) {
				this.currentPage = 5;
			}
			if (this.currentPage == 5) {
				this.currentPage = 3;
				if (this.prevent_err == 6) {
					this.currentPage = 5;
				}
			}
			if (this.prevent_err == 6) {
				this.prevent_err = 0;
			}
		},
		endAssistant() {
			if(this.installAssistantActive){
				this.installAssistantActive = false;
				this.normalMode = true;
			}
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
