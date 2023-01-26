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
									@buttonClicked="
										sendSystemCommand('systemUpdate', {})
									"
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
			<form name="backupRestoreForm">
				<openwb-base-card
					title="Sicherung / Wiederherstellung"
					subtype="success"
					:collapsible="true"
					:collapsed="true"
				>
					<openwb-base-heading>Sicherung</openwb-base-heading>
					<openwb-base-alert subtype="danger">
						Aktuell können nur Sicherungen wiederhergestellt werden,
						die in den Entwicklungszweigen "master" oder "Beta"
						erstellt wurden!
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
					<hr />
					<openwb-base-heading>Wiederherstellung</openwb-base-heading>
					<openwb-base-alert subtype="danger">
						Diese Funktion ist noch in Entwicklung! Es kann
						potentiell das System unbrauchbar werden. Nach
						Möglichkeit vorher ein Image der Installation
						erstellen!<br />
						Für die Wiederherstellung wird eine aktive
						Internetverbindung benötigt.<br />
						Aktuell können nur Sicherungen wiederhergestellt werden,
						die in den Entwicklungszweigen "master" oder "Beta"
						erstellt wurden!
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
								@change="updateSelectedFile($event)"
							/>
							<label
								id="input-file-label"
								class="custom-file-label"
								for="input-file"
								data-browse="Suchen"
							>
								{{
									selectedFile
										? selectedFile.name
										: "Bitte eine Datei auswählen"
								}}
							</label>
						</div>
						<div class="input-group-append">
							<button
								class="btn"
								:class="
									selectedFile
										? 'btn-success clickable'
										: 'btn-outline-success'
								"
								:disabled="!selectedFile"
								type="button"
								@click="uploadFile()"
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
								@buttonClicked="
									sendSystemCommand('restoreBackup')
								"
							>
								Wiederherstellung starten
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'box-open']"
								/>
							</openwb-base-click-button>
						</div>
					</div>
					<template #footer></template>
				</openwb-base-card>
			</form>
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
						Das ist eine experimentelle Option! Verwendung auf
						eigene Gefahr. Im schlimmsten Fall muss das system neu
						installiert werden!<br />
						ToDo:
						<ul>
							<li>do not allow downgrade</li>
						</ul>
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
									@buttonClicked="
										sendSystemCommand('systemUpdate', {
											branch: $store.state.mqtt[
												'openWB/system/current_branch'
											],
											tag: selectedTag,
										})
									"
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

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "OpenwbSystem",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/system/current_commit",
				"openWB/system/current_branch_commit",
				"openWB/system/current_missing_commits",
				"openWB/system/available_branches",
				"openWB/system/current_branch",
			],
			warningAcknowledged: false,
			selectedTag: "*HEAD*",
			selectedFile: undefined,
			restoreUploadDone: false,
		};
	},
	computed: {
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
		updateSelectedFile(event) {
			this.selectedFile = event.target.files[0];
			console.log("selectedFile", this.selectedFile);
		},
		uploadFile() {
			if (this.selectedFile !== undefined) {
				let formData = new FormData();
				formData.append("backupFile", this.selectedFile);
				this.axios
					.post(
						location.protocol +
							"//" +
							location.host +
							"/openWB/web/settings/uploadBackup.php",
						formData,
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
						}
					)
					.then((response) => {
						console.log("POST response", response.data);
						const successMessage =
							"Die Sicherungsdatei wurde erfolgreich hochgeladen. " +
							"Sie können die Wiederherstellung jetzt starten.";
						const timestamp = Math.floor(Date.now() / 1000);
						this.$store.commit("addTopic", {
							topic:
								"openWB/command/" +
								this.$root.mqttClientId +
								"/messages/" +
								timestamp,
							payload: {
								source: "command",
								type: "success",
								message: successMessage,
								timestamp: timestamp,
							},
						});
						this.restoreUploadDone = true;
					})
					.catch((error) => {
						var alertMessage =
							"Hochladen der Datei fehlgeschlagen!<br />";
						if (error.response) {
							// The request was made and the server responded with a status code
							// that falls out of the range of 2xx
							console.log(
								error.response.status,
								error.response.data
							);
							alertMessage +=
								error.response.status +
								": " +
								error.response.data;
						} else if (error.request) {
							// The request was made but no response was received
							// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
							// http.ClientRequest in node.js
							console.log(error.request);
							alertMessage +=
								"Es wurde keine Antwort vom Server empfangen.";
						} else {
							// Something happened in setting up the request that triggered an Error
							console.log("Error", error.message);
							alertMessage +=
								"Es ist ein unbekannter Fehler aufgetreten.";
						}
						const timestamp = Math.floor(Date.now() / 1000);
						this.$store.commit("addTopic", {
							topic:
								"openWB/command/" +
								this.$root.mqttClientId +
								"/messages/" +
								timestamp,
							payload: {
								source: "command",
								type: "danger",
								message: alertMessage,
								timestamp: timestamp,
							},
						});
						this.restoreUploadDone = false;
					});
			} else {
				console.error("no file selected for upload");
			}
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
