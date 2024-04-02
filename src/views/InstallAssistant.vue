<template>
	<!--InstallWizard boots at startup until Wizard is closed once-->
	<div>
		<div v-if="!instAssist">
			<openwb-base-heading>
				Vielen Dank, dass Sie sich für openWB entschieden haben
			</openwb-base-heading>
			<h3>
				Dieser Assistent führt Sie durch die Konfiguration der einzelnen
				Module:
			</h3>
			<ol>
				<h4><li>Update des Systems</li></h4>
				<h4><li>Auswahl primary / secondary openWB</li></h4>
				<h4><li>Einrichten der Geräte und Komponenten</li></h4>
				<h4><li>Konfiguration von Geräten und Komponenten</li></h4>
				<h4><li>Konfiguration Lastmanagement</li></h4>
				<h4><li>Einrichten der Ladepunkte</li></h4>
				<h4><li>Einrichten der Fahrzeuge</li></h4>
				<h4><li>Sicherung der Erstkonfiguration</li></h4>
			</ol>

			<div class="pageZero">
				<openwb-base-click-button
					class="buttonStart"
					@buttonClicked="toDatamanagement1"
				>
					Assistent starten
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>

		<div v-if="page1">
			<h2>System - Datenverwaltung</h2>
			<div class="page">
				<div class="pageText">
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
				<div class="pageEmbedded">
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
			<div class="buttons">
				<openwb-base-click-button
					class="buttonForward"
					@buttonClicked="toSystem"
					@buttonClicked.once="scrollToTop"
				>
					Weiter...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonBack"
					@buttonClicked="toSystem"
					@buttonClicked.once="scrollToTop"
				>
					Überspringen...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonEnd"
					@buttonClicked="toEnd"
					@buttonClicked.once="scrollToTop"
				>
					Assistent beenden
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>

		<div v-if="page2">
			<h2>System - System</h2>
			<div class="page">
				<div class="pageText">
					<p>
						Ein System Update durchführen um die Software auf den
						neuesten Stand zu bringen.
					</p>
					<p>
						Das garantiert, dass die openWB mit den neuesten
						Features und Funktionen ausgestattet ist.
					</p>
				</div>
				<div class="pageEmbedded">
					<System @sendCommand="$emit('sendCommand', $event)" />
				</div>
			</div>
			<div class="buttons">
				<openwb-base-click-button
					class="buttonForward"
					@buttonClicked="toGenConfig"
					@buttonClicked.once="scrollToTop"
				>
					Weiter...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonEnd"
					@buttonClicked="toEnd"
					@buttonClicked.once="scrollToTop"
				>
					Assistent beenden
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>

		<div v-if="page3">
			<h2>Einstellungen - Allgemein</h2>
			<div class="page">
				<div class="pageText">
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
					<p class="fw-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="pageEmbedded">
					<GeneralConfig
						formName="generalConfigForm"
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
					/>
				</div>
			</div>
			<div class="buttons">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-click-button
						class="buttonForward"
						@buttonClicked="secChoice"
						@buttonClicked.once="scrollToTop"
					>
						Weiter...
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'undo']"
						/>
					</openwb-base-click-button>
				</div>
				<div v-else>
					<openwb-base-click-button
						class="buttonForward"
						@buttonClicked="toHardwareInst"
						@buttonClicked.once="scrollToTop"
					>
						Weiter...
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'undo']"
						/>
					</openwb-base-click-button>
				</div>

				<openwb-base-click-button
					class="buttonBack"
					@buttonClicked="toSystem"
					@buttonClicked.once="scrollToTop"
				>
					Zurück...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonEnd"
					@buttonClicked="toEnd"
					@buttonClicked.once="scrollToTop"
				>
					Assistent beenden
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>

		<div v-if="page4">
			<h2>Konfiguration - Ladepunkte</h2>
			<div class="page">
				<div class="pageText">
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
					<p class="fw-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="pageEmbedded">
					<!--ChargePointInstallation formName="chargePointInstallationForm"-->
					<ChargePointInstallation
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
						@sendCommand="$emit('sendCommand', $event)"
					/>
				</div>
			</div>
			<div class="buttons">
				<openwb-base-click-button
					class="buttonBack"
					@buttonClicked="toGenConfig"
					@buttonClicked.once="scrollToTop"
				>
					Zurück...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonEnd"
					@buttonClicked="toEnd"
					@buttonClicked.once="scrollToTop"
				>
					Assistent beenden
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>

		<div v-if="page5">
			<h2>Konfiguration - Geräte und Komponenten</h2>
			<div class="page">
				<div class="pageText">
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
					<p class="fw-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="pageEmbedded">
					<!--HardwareInstallation formName="hardwareInstallationForm"-->
					<HardwareInstallation
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
						@sendCommand="$emit('sendCommand', $event)"
					/>
				</div>
			</div>
			<div class="buttons">
				<openwb-base-click-button
					class="buttonForward"
					@buttonClicked="toLoadManagement1"
					@buttonClicked.once="scrollToTop"
				>
					Weiter...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonBack"
					@buttonClicked="toGenConfig"
					@buttonClicked.once="scrollToTop"
				>
					Zurück...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonEnd"
					@buttonClicked="toEnd"
					@buttonClicked.once="scrollToTop"
				>
					Assistent beenden
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>

		<div v-if="page6">
			<h2>Konfiguration - Lastmanagement</h2>
			<div class="page">
				<div class="pageText">
					<p>
						Im Lastmanagement werden die maximale Leistung sowie die
						maximalen Ströme für jede Phase des Zählermoduls sowie
						die maximale Ausgangsleistung des Wechselrichters der PV
						Anlage eingetragen, falls eine solche vorhanden ist.
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
						Es ist außerdem die Struktur des Lastmanagements zu
						überprüfen und ggf. anzupassen. Im Normalfall befinden
						sich Speicher und Wechselrichter in einer Ebene
						innerhalb des EVU-Zählers.
					</p>
					<p>
						Zwischenzähler können beliebig kaskadiert sein.
						Spezialfälle stellen Hybrid-Speicher, Solaredge mit
						mehreren Wechselrichtern sowie bspw. Victronspeicher mit
						integriertem Zähler dar.
					</p>
					<p>
						Werden hier keine vorhandenen Zählermodule oder
						Wechselrichtermodule angezeigt, dann bitte einen Schritt
						zurück und die entsprechenden Geräte und Komponenten
						hinzufügen.
					</p>
					<p class="fw-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="pageEmbedded">
					<LoadManagementConfig
						formName="loadManagementConfigForm"
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
					/>
				</div>
			</div>
			<div class="buttons">
				<openwb-base-click-button
					class="buttonForward"
					@buttonClicked="toChargePointInst"
					@buttonClicked.once="scrollToTop"
				>
					Weiter...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonBack"
					@buttonClicked="toHardwareInst"
					@buttonClicked.once="scrollToTop"
				>
					Zurück...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonEnd"
					@buttonClicked="toEnd"
					@buttonClicked.once="scrollToTop"
				>
					Assistent beenden
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>

		<div v-if="page7">
			<h2>Konfiguration - Ladepunkte</h2>
			<div class="page">
				<div class="pageText">
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
					<p class="fw-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="pageEmbedded">
					<!--ChargePointInstallation formName="chargePointInstallationForm"-->
					<ChargePointInstallation
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
						@sendCommand="$emit('sendCommand', $event)"
					/>
				</div>
			</div>
			<div class="buttons">
				<openwb-base-click-button
					class="buttonForward"
					@buttonClicked="toLoadManagement2"
					@buttonClicked.once="scrollToTop"
				>
					Weiter...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonBack"
					@buttonClicked="toLoadManagement1"
					@buttonClicked.once="scrollToTop"
				>
					Zurück...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonEnd"
					@buttonClicked="toEnd"
					@buttonClicked.once="scrollToTop"
				>
					Assistent beenden
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>

		<div v-if="page8">
			<h2>Konfiguration - Lastmanagement</h2>
			<div class="page">
				<div class="pageText">
					<p>
						Nachdem die Geräte konfiguriert und die Ladepunkte
						eingerichtet wurden, wird abschließend nochmal ein Blick
						auf das Lastmanagement geworfen. Dazu öffnet man den
						Menüpunkt Struktur.
					</p>
					<p>
						Im Normalfall befinden sich Speicher und Wechselrichter
						beide in einer Ebene innerhalb des EVU- Zählers.
					</p>
					<p>
						Die Ladepunkte (z.B. Externe openWB custom, Duo,...)
						befinden sich dann auch in derselben Ebene wie der
						Speicher und der Wechselrichter innerhalb der Ebene des
						EVU-Zählers.
					</p>
					<p>
						Wenn alles ok ist, kann dieser Schritt ohne weitere
						Anpassungen beendet werden.
					</p>
					<p class="fw-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="pageEmbedded">
					<LoadManagementConfig
						formName="loadManagementConfigForm"
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
					/>
				</div>
			</div>
			<div class="buttons">
				<openwb-base-click-button
					class="buttonForward"
					@buttonClicked="toVehicleConfig"
					@buttonClicked.once="scrollToTop"
				>
					Weiter...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonBack"
					@buttonClicked="toChargePointInst"
					@buttonClicked.once="scrollToTop"
				>
					Zurück...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonEnd"
					@buttonClicked="toEnd"
					@buttonClicked.once="scrollToTop"
				>
					Assistent beenden
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>

		<div v-if="page9">
			<h2>Konfiguration - Fahrzeuge</h2>
			<div class="page">
				<div class="pageText">
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
					<p class="fw-bold">
						Wichtig: Die Phasigkeit des Fahrzeugs ist richtig
						einzutragen!
					</p>

					<p>
						Kennt man die Phasigkeit des Fahrzeugs nicht (z.B.
						Besucherfahrzeug) besser ein Besucherfahrzeugprofil
						anlegen, welches die Phasenumschaltung unterdrückt.
					</p>
					<p class="fw-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="pageEmbedded">
					<!--VehicleConfig formName="vehicleConfigForm"-->
					<VehicleConfig
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
						@sendCommand="$emit('sendCommand', $event)"
					/>
				</div>
			</div>
			<div class="buttons">
				<openwb-base-click-button
					class="buttonForward"
					@buttonClicked="toDatamanagement2"
					@buttonClicked.once="scrollToTop"
				>
					Weiter...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonBack"
					@buttonClicked="toLoadManagement2"
					@buttonClicked.once="scrollToTop"
				>
					Zurück...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonEnd"
					@buttonClicked="toEnd"
					@buttonClicked.once="scrollToTop"
				>
					Assistent beenden
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>

		<div v-if="page10">
			<h2>System - Datenverwaltung</h2>
			<div class="page">
				<div class="pageText">
					<p>
						Zum Schluss eine Sicherung der vorgenommenen
						Konfiguration anfertigen, falls gewünscht.
					</p>
				</div>
				<div class="pageEmbedded">
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
			<div class="buttons">
				<openwb-base-click-button
					class="buttonBack"
					@buttonClicked="toVehicleConfig"
					@buttonClicked.once="scrollToTop"
				>
					Zurück...
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>

				<openwb-base-click-button
					class="buttonEnd"
					@buttonClicked="toEnd"
					@buttonClicked.once="scrollToTop"
				>
					Assistent beenden
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
			</div>
		</div>
	</div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import DataManagement from "./DataManagement.vue";
import System from "./System.vue";
import GeneralConfig from "./GeneralConfig.vue";
import ChargePointInstallation from "./ChargePointInstallation.vue";
import HardwareInstallation from "./HardwareInstallation.vue";
import LoadManagementConfig from "./LoadManagementConfig.vue";
import VehicleConfig from "./VehicleConfig.vue";
import ComponentState from "../components/mixins/ComponentState.vue";

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
			instAssist: false,
			page1: false,
			page2: false,
			page3: false,
			page4: false,
			page5: false,
			page6: false,
			page7: false,
			page8: false,
			page9: false,
			page10: false,
			second_choice: false,
		};
	},
	computed: {},
	methods: {
		scrollToTop() {
			window.scrollTo(0, 0);
		},
		toDatamanagement1() {
			this.instAssist = true;
			this.page1 = true;
		},
		toSystem() {
			this.page1 = false;
			this.page2 = true;
			if (this.page3) {
				this.page3 = false;
			}
		},
		toGenConfig() {
			this.page2 = false;
			this.page3 = true;
			if (this.page5) {
				this.page5 = false;
			}
			if (this.page4) {
				this.page4 = false;
			}
		},
		secChoice() {
			this.second_choice = true;
			this.page3 = false;
			this.page4 = true;
		},
		toHardwareInst() {
			this.page3 = false;
			this.page5 = true;
			if (this.page6) {
				this.page6 = false;
			}
		},
		toLoadManagement1() {
			this.page5 = false;
			this.page6 = true;
			if (this.page7) {
				this.page7 = false;
			}
		},
		toChargePointInst() {
			this.page6 = false;
			this.page7 = true;
			if (this.page8) {
				this.page8 = false;
			}
		},
		toLoadManagement2() {
			this.page7 = false;
			this.page8 = true;
			if (this.page9) {
				this.page9 = false;
			}
		},
		toVehicleConfig() {
			this.page8 = false;
			this.page9 = true;
			if (this.page10) {
				this.page10 = false;
			}
		},
		toDatamanagement2() {
			this.page9 = false;
			this.page10 = true;
		},
		toEnd() {
			//First time access to InstallWizard if "Assistent beenden" is pressed -> Wizard will not show on Startup anymore!
			if (!this.$store.state.mqtt["openWB/system/installWizard"]) {
				this.updateState("openWB/system/installWizard", true);
				this.$emit("save");
			}
			this.$router.push("/Status");
		},
	},
};
</script>

<style scoped>
.missing-commits {
	overflow-y: scroll;
	max-height: 20rem;
}
.btn {
	display: inline-block;
	margin: 60px;
	width: 20%;
}
.pageZero {
	display: flex;
	justify-content: center;
}
.buttonStart {
	width: 200px;
	background-color: rgb(8, 207, 8);
	margin: 10px;
}
.buttons {
	display: flex;
	justify-content: space-around;
}
.buttonForward {
	width: 200px;
	background-color: rgb(8, 207, 8);
	margin: 50px;
	margin-left: 0px;
}
.buttonBack {
	width: 200px;
	background-color: rgb(123, 137, 238);
	margin: 50px;
	margin-left: 10px;
}
.buttonEnd {
	width: 200px;
	background-color: rgb(215, 239, 27);
	margin: 50px;
}
.page {
	display: flex;
	gap: 10px;
}
.pageText {
	display: block;
	width: 20%;
	flex-shrink: 0;
}
.pageEmbedded {
	flex-grow: 1;
}
.fw-bold {
	font-weight: bold;
}
</style>
