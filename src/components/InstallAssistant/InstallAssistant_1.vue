<template #help>
	<div>
		<p>
			Wir empfehlen an dieser Stelle eine Sicherung der openWB
			zu erzeugen, auf welche man später zurückgreifen könnte,
			insbesondere, wenn die openWB schon konfiguriert war und
			der Assistent nun erneut ausgeführt wird.
		</p>
		<p>
			Dadurch werden gesammelte Daten/Einstellungen gesichert
			und können wieder hergestellt werden.
		</p>
		<p>
			Dazu Warnung akzeptieren, auf Sicherung /
			Wiederherstellung gehen und unter Sicherung auf
			Sicherung erstellen klicken.
		</p>
		<p>
			Es wird empfohlen regelmäßig Sicherungen der Daten zu
			erstellen.
		</p>
		<p>
			Soll der Assistent die openWB komplett neu einrichten,
			kann hier auch unter Zurücksetzen auf Zurücksetzen
			gedrückt werden, wodurch alle Einstellungen, angelegte
			Geräte/Komponenten, Ladepunkte und Fahrzeuge, usw...
			unwiederbringlich gelöscht werden.
		</p>
			<p>Dieser Schritt kann auch übersprungen werden.</p>
	</div>

	<div class="system">
		<openwb-base-alert subtype="danger">
			<h2>Achtung!</h2>
			<p>
				Vor allen Aktionen auf dieser Seite ist sicherzustellen, dass
				kein Ladevorgang aktiv ist! Zur Sicherheit bitte zusätzlich alle
				Fahrzeuge von der Ladestation / den Ladestationen abstecken!
			</p>
			<openwb-base-button-group-input
				title="Ich habe die Warnung verstanden"
				:buttons="[
					{
						buttonValue: false,
						text: 'Nein',
						class: 'btn-outline-danger',
					},
					{
						buttonValue: true,
						text: 'Ja',
						class: 'btn-outline-success',
					},
				]"
				v-model="this.warningAcknowledged"
			/>
		</openwb-base-alert>
		<div v-if="warningAcknowledged">
			<openwb-base-card
				title="Sicherung / Wiederherstellung"
				subtype="success"
				:collapsible="true"
				:collapsed="true"
			>
				<form name="backupForm">
					<openwb-base-heading>Sicherung</openwb-base-heading>
					<openwb-base-alert subtype="danger">
						Aktuell können nur Sicherungen wiederhergestellt werden,
						die in den Entwicklungszweigen "master", "Beta" oder
						"Release" erstellt wurden!
					</openwb-base-alert>
					<openwb-base-alert subtype="info">
						Nachdem die Sicherung abgeschlossen ist, kann die
						erstellte Datei über den Link in der Benachrichtigung
						oder
						<a href="/openWB/data/backup/" target="_blank">hier</a>
						heruntergeladen werden.
					</openwb-base-alert>
					<div class="row justify-content-center">
						<div
							class="col-md-4 d-flex py-1 justify-content-center"
						>
							<openwb-base-click-button
								class="btn-success clickable"
								@buttonClicked="
									sendSystemCommand('createBackup', {
										use_extended_filename: true,
									})
								"
							>
								Sicherung erstellen
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'archive']"
								/>
							</openwb-base-click-button>
						</div>
					</div>
				</form>
				<hr />
				<form name="restoreForm">
					<openwb-base-heading>Wiederherstellung</openwb-base-heading>
					<openwb-base-alert subtype="danger">
						Für die Wiederherstellung wird eine aktive
						Internetverbindung benötigt.<br />
						Aktuell können nur Sicherungen wiederhergestellt werden,
						die in den Entwicklungszweigen "master", "Beta" oder
						"Release" erstellt wurden!
					</openwb-base-alert>
					<div class="input-group">
						<div class="input-group-prepend">
							<div class="input-group-text">
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'file-archive']"
								/>
							</div>
						</div>
						<div class="custom-file">
							<input
								id="input-file"
								type="file"
								class="custom-file-input"
								accept=".tar.gz,application/gzip,application/tar+gzip"
								@change="updateSelectedRestoreFile($event)"
							/>
							<label
								id="input-file-label"
								class="custom-file-label"
								for="input-file"
								data-browse="Suchen"
							>
								{{
									selectedRestoreFile
										? selectedRestoreFile.name
										: "Bitte eine Datei auswählen"
								}}
							</label>
						</div>
						<div class="input-group-append">
							<button
								class="btn"
								:class="
									selectedRestoreFile
										? 'btn-success clickable'
										: 'btn-outline-success'
								"
								:disabled="!selectedRestoreFile"
								type="button"
								@click="uploadRestoreFile()"
							>
								Hochladen
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'upload']"
								/>
							</button>
						</div>
					</div>
					<div class="row justify-content-center">
						<div
							class="col-md-4 d-flex py-1 justify-content-center"
						>
							<openwb-base-click-button
								:class="
									restoreUploadDone
										? 'btn-success clickable'
										: 'btn-outline-success'
								"
								:disabled="!restoreUploadDone"
								@buttonClicked="restoreBackup()"
							>
								Wiederherstellung starten
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'box-open']"
								/>
							</openwb-base-click-button>
						</div>
					</div>
				</form>
				<hr />
				<form name="cloudBackupForm">
					<openwb-base-heading>
						Automatische Sicherung in einen Cloud-Dienst
					</openwb-base-heading>
					<openwb-base-alert subtype="info">
						Zwischen Mitternacht und 5:00 Uhr wird automatisch eine
						Sicherung erstellt und in den angegebenen Cloud-Dienst
						(nicht openWB Cloud!) hochgeladen. Ist kein Cloud-Dienst
						konfiguriert, wird keine automatische Sicherung
						erstellt. Die automatische Sicherung kann unabhängig von
						der openWB Cloud genutzt werden.<br />
						Die Anleitung zur Konfiguration des Cloud-Dienstes
						findest Du
						<a
							href="https://github.com/openWB/core/wiki/Cloud-Sicherung"
							target="_blank"
							rel="noopener noreferrer"
						>
							hier
						</a>
						.
					</openwb-base-alert>
					<openwb-base-select-input
						class="mb-2"
						title="Backup-Cloud"
						:options="backupCloudList"
						:model-value="
							$store.state.mqtt[
								'openWB/system/backup_cloud/config'
							].type
						"
						@update:model-value="updateSelectedBackupCloud($event)"
					/>
					<div
						v-if="
							$store.state.mqtt[
								'openWB/system/backup_cloud/config'
							].type
						"
					>
						<openwb-base-button-group-input
							title="Sicherung vor System Update"
							:buttons="[
								{
									buttonValue: false,
									text: 'Nein',
									class: 'btn-outline-danger',
								},
								{
									buttonValue: true,
									text: 'Ja',
									class: 'btn-outline-success',
								},
							]"
							:model-value="
								$store.state.mqtt[
									'openWB/system/backup_cloud/backup_before_update'
								]
							"
							@update:model-value="
								updateState(
									'openWB/system/backup_cloud/backup_before_update',
									$event,
								)
							"
						>
							<template #help>
								Ist diese Option aktiviert, dann wird vor jedem
								System-Update automatisch eine Sicherung
								erstellt und diese in die Backup-Cloud
								hochgeladen.
							</template>
						</openwb-base-button-group-input>
						<openwb-base-button-input
							title="Manuelle Cloud-Sicherung"
							buttonText="Sicherung erstellen und hochladen"
							subtype="success"
							@buttonClicked="
								sendSystemCommand('createCloudBackup', {})
							"
						/>
						<openwb-backup-cloud-proxy
							:backupCloud="
								$store.state.mqtt[
									'openWB/system/backup_cloud/config'
								]
							"
							@update:configuration="
								updateConfiguration(
									'openWB/system/backup_cloud/config',
									$event,
								)
							"
							@sendCommand="
								sendSystemCommand($event.command, $event.args)
							"
						/>
					</div>
					<openwb-base-submit-buttons
						formName="cloudBackupForm"
						:hideReset="true"
						:hideDefaults="true"
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
					/>
				</form>
			</openwb-base-card>
			<openwb-base-card
				title="Datenübernahme"
				subtype="success"
				:collapsible="true"
				:collapsed="true"
			>
				<form name="dataMigrationForm">
					<openwb-base-alert subtype="info">
						Hier kann die Sicherung einer älteren 1.9er Version
						hochgeladen werden, um vorhandene historische Daten
						(Diagramme und Ladeprotokolle) sowie Cloud-Daten und
						Seriennummer in diese Installation zu importieren. Die
						Zuordnung zwischen den alten und neuen Komponenten muss
						manuell durchgeführt werden.
					</openwb-base-alert>
					<openwb-base-alert subtype="danger">
						Die Portierung kann bei vielen historischen Daten von
						mehreren Jahren durchaus bis zu 30 Minuten dauern. Die
						openWB in dieser Zeit bitte nicht herunterfahren! Du
						erhältst eine Meldung, wenn die Datenübernahme
						abgeschlossen ist.<br />
						Vor der Datenübernahme unbedingt eine Sicherung
						erstellen.<br />
						Die Datenübernahme kann nur durch Einspielen einer
						Sicherung rückgängig gemacht werden!
					</openwb-base-alert>
					<div class="input-group">
						<div class="input-group-prepend">
							<div class="input-group-text">
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'file-archive']"
								/>
							</div>
						</div>
						<div class="custom-file">
							<input
								id="data-migration-file"
								type="file"
								class="custom-file-input"
								accept=".tar.gz,application/gzip,application/tar+gzip"
								@change="
									updateSelectedDataMigrationFile($event)
								"
							/>
							<label
								id="data-migration-file-label"
								class="custom-file-label"
								for="data-migration-file"
								data-browse="Suchen"
							>
								{{
									selectedDataMigrationFile
										? selectedDataMigrationFile.name
										: "Bitte eine Datei auswählen"
								}}
							</label>
						</div>
						<div class="input-group-append">
							<button
								class="btn"
								:class="
									selectedDataMigrationFile
										? 'btn-success clickable'
										: 'btn-outline-success'
								"
								:disabled="!selectedDataMigrationFile"
								type="button"
								@click="uploadDataMigrationFile()"
							>
								Hochladen
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'upload']"
								/>
							</button>
						</div>
					</div>
					<openwb-base-heading
						>Zuordnung der Komponenten</openwb-base-heading
					>
					<div
						v-for="section in dataMigrationConfig"
						:key="section.sectionName"
					>
						<openwb-base-heading>
							{{ section.sectionName }}
						</openwb-base-heading>
						<openwb-base-select-input
							v-for="configuration in section.sectionComponents"
							:key="configuration.key"
							:title="configuration.label"
							:options="
								getMigrationOptions(configuration.validTypes)
							"
							v-model="dataMigrationMapping[configuration.key]"
						>
							<template v-if="configuration.help" #help>{{
								configuration.help
							}}</template>
						</openwb-base-select-input>
					</div>
					<div class="row justify-content-center">
						<div
							class="col-md-4 d-flex py-1 justify-content-center"
						>
							<openwb-base-click-button
								:class="
									dataMigrationUploadDone
										? 'btn-success clickable'
										: 'btn-outline-success'
								"
								:disabled="!dataMigrationUploadDone"
								@buttonClicked="dataMigration()"
							>
								Datenübernahme starten
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'box-open']"
								/>
							</openwb-base-click-button>
						</div>
					</div>
				</form>
			</openwb-base-card>
			<form name="resetForm">
				<openwb-base-card
					title="Zurücksetzen"
					subtype="danger"
					:collapsible="true"
					:collapsed="true"
				>
					<openwb-base-alert subtype="danger">
						Alle Einstellungen, angelegte Geräte/Komponenten,
						Ladepunkte und Fahrzeuge, etc, Tages-, Monats- und
						Jahresauswertungen sowie das Ladeprotokoll werden
						unwiederbringlich gelöscht. Auch die Vorkonfiguration im
						Auslieferungszustand wird gelöscht. Die openWB muss
						danach komplett neu eingerichtet werden. Die openWB wird
						hierfür automatisch neu gestartet. Bitte erstelle vor
						dem Zurücksetzen eine Sicherung!
					</openwb-base-alert>
					<template #footer>
						<div class="row justify-content-center">
							<div
								class="col-md-4 d-flex py-1 justify-content-center"
							>
								<openwb-base-click-button
									class="btn-danger clickable"
									@buttonClicked="factoryReset()"
								>
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'skull-crossbones']"
									/>
									Zurücksetzen
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'skull-crossbones']"
									/>
								</openwb-base-click-button>
							</div>
						</div>
					</template>
				</openwb-base-card>
			</form>
		</div>
	</div>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCaretLeft as fasCaretLeft,
	faCaretRight as fasCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


library.add(fasCaretLeft, fasCaretRight);

export default {
	name: 'InstallAssistantPage1',
	mixins: [ComponentState],
	emits: ["save", "reset", "default", "sendCommand"],
	props: [],
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			currentPage: 1,
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
			this.$router.push('InstallAssistant2');
		},
		previousPage() {
			window.scrollTo(0, 0);
			this.$router.push('InstallAssistant');
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
