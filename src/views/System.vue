<template>
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
			<form name="versionInfoForm">
				<openwb-base-card
					title="Versions-Informationen / Aktualisierung"
					subtype="success"
					:collapsible="true"
					:collapsed="true"
				>
					<openwb-base-text-input
						title="Entwicklungszweig"
						readonly
						v-model="
							$store.state.mqtt['openWB/system/current_branch']
						"
					/>
					<openwb-base-text-input
						title="installierte Version"
						readonly
						:class="
							updateAvailable ? 'text-danger' : 'text-success'
						"
						v-model="
							$store.state.mqtt['openWB/system/current_commit']
						"
					/>
					<openwb-base-text-input
						title="aktuellste Version"
						readonly
						v-model="
							$store.state.mqtt[
								'openWB/system/current_branch_commit'
							]
						"
					/>
					<openwb-base-card
						v-if="updateAvailable"
						title="Änderungen"
						subtype="info"
						:collapsible="true"
						:collapsed="true"
					>
						<ul class="missing-commits">
							<li
								v-for="(commit, key) in $store.state.mqtt[
									'openWB/system/current_missing_commits'
								]"
								:key="key"
							>
								{{ commit }}
							</li>
						</ul>
					</openwb-base-card>
					<openwb-base-alert subtype="danger">
						Nach einem Update wird die Ladestation direkt neu
						gestartet! Es werden alle eventuell vorhandenen lokalen
						Änderungen am Programmcode mit dem Update verworfen!
					</openwb-base-alert>
					<template #footer>
						<div class="row justify-content-center">
							<div
								class="col-md-4 d-flex py-1 justify-content-center"
							>
								<openwb-base-click-button
									class="btn-info"
									@buttonClicked="
										sendSystemCommand('systemFetchVersions')
									"
								>
									Informationen aktualisieren
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'download']"
									/>
								</openwb-base-click-button>
							</div>
							<div
								class="col-md-4 d-flex py-1 justify-content-center"
							>
								<openwb-base-click-button
									:class="
										updateAvailable
											? 'btn-success clickable'
											: 'btn-outline-success'
									"
									:disabled="!updateAvailable"
									@buttonClicked="systemUpdate()"
								>
									Update
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'arrow-alt-circle-up']"
									/>
								</openwb-base-click-button>
							</div>
						</div>
					</template>
				</openwb-base-card>
			</form>
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
						<openwb-base-button-input
							title="Manuelle Cloud-Sicherung"
							buttonText="Sicherung erstellen und hochladen"
							subtype="success"
							@buttonClicked="
								sendSystemCommand('createCloudBackup', {})
							"
						/>
						<openwb-backup-cloud-proxy
							:backupCloudType="
								$store.state.mqtt[
									'openWB/system/backup_cloud/config'
								].type
							"
							:configuration="
								$store.state.mqtt[
									'openWB/system/backup_cloud/config'
								].configuration
							"
							@update:configuration="
								updateConfiguration(
									'openWB/system/backup_cloud/config',
									$event
								)
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
			<form name="powerForm">
				<openwb-base-card
					title="Betrieb"
					:collapsible="true"
					:collapsed="true"
				>
					<openwb-base-alert subtype="danger">
						Wenn die Ladestation ausgeschaltet wird, muss sie
						komplett spannungsfrei geschaltet werden. Erst beim
						erneuten Zuschalten der Spannung fährt das System wieder
						hoch.
					</openwb-base-alert>
					<template #footer>
						<div class="row justify-content-center">
							<div
								class="col-md-4 d-flex py-1 justify-content-center"
							>
								<openwb-base-click-button
									class="btn-warning"
									@buttonClicked="
										sendSystemCommand('systemReboot')
									"
								>
									Neustart
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'undo']"
									/>
								</openwb-base-click-button>
							</div>
							<div
								class="col-md-4 d-flex py-1 justify-content-center"
							>
								<openwb-base-click-button
									class="btn-danger"
									@buttonClicked="
										sendSystemCommand('systemShutdown')
									"
								>
									Ausschalten
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'power-off']"
									/>
								</openwb-base-click-button>
							</div>
						</div>
					</template>
				</openwb-base-card>
			</form>
			<form name="releaseChangeForm">
				<openwb-base-card
					title="Entwicklungszweig"
					subtype="danger"
					:collapsible="true"
					:collapsed="true"
				>
					<openwb-base-alert subtype="danger">
						Nach einem Wechsel wird die Ladestation direkt neu
						gestartet! Es werden alle lokalen Änderungen mit dem
						Wechsel verworfen!
					</openwb-base-alert>
					<openwb-base-alert subtype="warning">
						Bevor auf einen neuen Entwicklungszweig gewechselt wird
						sollte immer eine Sicherung erstellt werden! Es kann
						zwar wieder auf eine ältere Version gewechselt werden,
						jedoch ist nicht sichergestellt, dass es dabei keine
						Probleme gibt. Gerade wenn das Datenformat in der neuen
						Version angepasst wurde, wird eine ältere damit Fehler
						produzieren.<br />
						Für den normalen Betrieb wird der Zweig "Release"
						empfohlen. Der Softwarestand wurde ausgiebig getestet,
						sodass ein Fehlverhalten relativ unwahrscheinlich
						ist.<br />
						Der "Beta" Zweig beinhaltet Vorabversionen, bei denen
						die Entwicklung soweit abgeschlossen ist. Die
						enthaltenen Anpassungen wurden rudimentär getestet,
						können aber durchaus noch Fehler enthalten.<br />
						Die aktuelle Softwareentwicklung findet im Zweig
						"master" statt. Die enthaltenen Anpassungen sind
						teilweise noch nicht getestet und enthalten potentiell
						Fehler.<br />
						Einträge, die mit "feature" beginnen, sind
						experimentelle Entwicklungszweige, die nicht für den
						allgemeinen Gebrauch gedacht sind.
					</openwb-base-alert>
					<openwb-base-select-input
						title="Entwicklungszweig"
						:options="getBranchOptions()"
						:model-value="
							$store.state.mqtt['openWB/system/current_branch']
						"
						@update:model-value="
							updateState('openWB/system/current_branch', $event)
						"
					/>
					<openwb-base-select-input
						title="Tag"
						:options="getBranchTagOptions()"
						v-model="selectedTag"
					/>
					<template #footer>
						<div class="row justify-content-center">
							<div
								class="col-md-4 d-flex py-1 justify-content-center"
							>
								<openwb-base-click-button
									:class="
										releaseChangeValid
											? 'btn-danger clickable'
											: 'btn-outline-danger'
									"
									:disabled="!releaseChangeValid"
									@buttonClicked="switchBranch()"
								>
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'skull-crossbones']"
									/>
									Branch und Tag wechseln
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
									@buttonClicked="
										sendSystemCommand('factoryReset', {})
									"
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
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faArrowAltCircleUp as fasArrowAltCircleUp,
	faUndo as fasUndo,
	faPowerOff as fasPowerOff,
	faDownload as fasDownload,
	faSkullCrossbones as fasSkullCrossbones,
	faArchive as fasArchive,
	faFileArchive as fasFileArchive,
	faUpload as fasUpload,
	faBoxOpen as fasBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
library.add(
	fasArrowAltCircleUp,
	fasUndo,
	fasPowerOff,
	fasDownload,
	fasSkullCrossbones,
	fasArchive,
	fasFileArchive,
	fasUpload,
	fasBoxOpen
);
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbBackupCloudProxy from "../components/backup_clouds/OpenwbBackupCloudProxy.vue";

export default {
	name: "OpenwbSystem",
	mixins: [ComponentState],
	emits: ["sendCommand"],
	components: {
		FontAwesomeIcon,
		OpenwbBackupCloudProxy,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/system/configurable/backup_clouds",
				"openWB/system/current_commit",
				"openWB/system/current_branch_commit",
				"openWB/system/current_missing_commits",
				"openWB/system/available_branches",
				"openWB/system/current_branch",
				"openWB/system/backup_cloud/config",
			],
			warningAcknowledged: false,
			selectedTag: "*HEAD*",
			selectedRestoreFile: undefined,
			restoreUploadDone: false,
		};
	},
	computed: {
		backupCloudList() {
			return this.$store.state.mqtt[
				"openWB/system/configurable/backup_clouds"
			];
		},
		updateAvailable() {
			return (
				this.$store.state.mqtt["openWB/system/current_branch_commit"] &&
				this.$store.state.mqtt["openWB/system/current_branch_commit"] !=
					this.$store.state.mqtt["openWB/system/current_commit"]
			);
		},
		releaseChangeValid() {
			return (
				this.$store.state.mqtt["openWB/system/current_branch"] in
					this.$store.state.mqtt[
						"openWB/system/available_branches"
					] &&
				"tags" in
					this.$store.state.mqtt["openWB/system/available_branches"][
						this.$store.state.mqtt["openWB/system/current_branch"]
					] &&
				(this.selectedTag in
					this.$store.state.mqtt["openWB/system/available_branches"][
						this.$store.state.mqtt["openWB/system/current_branch"]
					]["tags"] ||
					this.selectedTag == "*HEAD*")
			);
		},
	},
	methods: {
		getBackupCloudDefaultConfiguration(backupCloudType) {
			const backupCloudDefaults = this.backupCloudList.find(
				(element) => element.value == backupCloudType
			);
			if (
				Object.prototype.hasOwnProperty.call(
					backupCloudDefaults,
					"defaults"
				)
			) {
				return { ...backupCloudDefaults.defaults };
			}
			console.warn(
				"no default configuration found for backup cloud type!",
				backupCloudType
			);
			return {};
		},
		sendSystemCommand(command, data = {}) {
			this.$emit("sendCommand", {
				command: command,
				data: data,
			});
		},
		getBranchOptions() {
			var source =
				this.$store.state.mqtt["openWB/system/available_branches"];
			var options = [];
			if (source !== undefined) {
				for (const [key, value] of Object.entries(source)) {
					options.push({
						value: key,
						text: key + " (" + value.commit + ")",
					});
				}
			}
			return options;
		},
		getBranchTagOptions() {
			if (
				!(
					this.$store.state.mqtt["openWB/system/current_branch"] in
					this.$store.state.mqtt["openWB/system/available_branches"]
				)
			) {
				return [];
			}
			var source =
				this.$store.state.mqtt["openWB/system/available_branches"][
					this.$store.state.mqtt["openWB/system/current_branch"]
				]["tags"];
			var options = [];
			if (source !== undefined) {
				for (const [key, value] of Object.entries(source)) {
					options.unshift({
						value: key,
						text: value,
					});
				}
			}
			options.unshift({
				value: "*HEAD*",
				text: "Aktuellster Stand",
			});
			return options;
		},
		updateConfiguration(key, event) {
			console.debug("updateConfiguration", key, event);
			this.updateState(key, event.value, event.object);
		},
		updateSelectedBackupCloud($event) {
			this.updateState(
				"openWB/system/backup_cloud/config",
				$event,
				"type"
			);
			this.updateState(
				"openWB/system/backup_cloud/config",
				this.getBackupCloudDefaultConfiguration($event)
			);
		},
		updateSelectedRestoreFile(event) {
			this.selectedRestoreFile = event.target.files[0];
		},
		uploadFile(target, selectedFile, successMessage) {
			if (selectedFile !== undefined) {
				let formData = new FormData();
				formData.append("file", selectedFile);
				formData.append("target", target);
				this.axios
					.post(
						location.protocol +
							"//" +
							location.host +
							"/openWB/web/settings/uploadFile.php",
						formData,
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
						}
					)
					.then((response) => {
						this.$root.postClientMessage(successMessage, "success");
						this.restoreUploadDone = true;
					})
					.catch((error) => {
						if (error.response) {
							// The request was made and the server responded with a status code
							// that falls out of the range of 2xx
							console.error(
								error.response.status,
								error.response.data
							);
							var alertMessage =
								"Hochladen der Datei fehlgeschlagen!" +
								"<br />" +
								error.response.status +
								": " +
								error.response.data;
						} else if (error.request) {
							// The request was made but no response was received
							// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
							// http.ClientRequest in node.js
							console.error(error.request);
							alertMessage +=
								"Es wurde keine Antwort vom Server empfangen.";
						} else {
							// Something happened in setting up the request that triggered an Error
							console.error("Error", error.message);
							alertMessage +=
								"Es ist ein unbekannter Fehler aufgetreten.";
						}
						this.$root.postClientMessage(alertMessage, "danger");
						this.restoreUploadDone = false;
					});
			} else {
				console.error("no file selected for upload");
			}
		},
		uploadRestoreFile() {
			const successMessage =
				"Die Sicherungsdatei wurde erfolgreich hochgeladen. " +
				"Sie können die Wiederherstellung jetzt starten.";
			this.uploadFile("restore", this.selectedRestoreFile, successMessage);
			},
		systemUpdate() {
			this.sendSystemCommand("systemUpdate", {});
			this.$store.commit("storeLocal", {
				name: "reloadRequired",
				value: true,
			});
		},
		switchBranch() {
			this.sendSystemCommand("systemUpdate", {
				branch: this.$store.state.mqtt["openWB/system/current_branch"],
				tag: this.selectedTag,
			});
			this.$store.commit("storeLocal", {
				name: "reloadRequired",
				value: true,
			});
		},
		restoreBackup() {
			this.sendSystemCommand("restoreBackup");
			this.$store.commit("storeLocal", {
				name: "reloadRequired",
				value: true,
			});
		},
	},
};
</script>

<style scoped>
.missing-commits {
	overflow-y: scroll;
	max-height: 20rem;
}
</style>
