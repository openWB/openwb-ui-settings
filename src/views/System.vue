<template>
	<div class="power">
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
				<openwb-base-card title="Versions-Informationen">
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
								'openWB/system/current_master_commit'
							]
						"
					/>
					<div v-if="updateAvailable">
						<openwb-base-heading>Änderungen</openwb-base-heading>
						<ul>
							<li
								v-for="(commit, key) in $store.state.mqtt[
									'openWB/system/current_missing_commits'
								]"
								:key="key"
							>
								{{ commit }}
							</li>
						</ul>
					</div>
					<template #footer>
						<div class="row justify-content-center">
							<div
								class="col-md-4 d-flex py-1 justify-content-center"
							>
								<openwb-base-click-button
									class="btn-success"
									@click="
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
						</div>
					</template>
				</openwb-base-card>
			</form>
			<form name="updateForm">
				<openwb-base-card title="Versionsverwaltung">
					<openwb-base-alert subtype="danger">
						Nach einem Update wird die Ladestation direkt neu
						gestartet!
					</openwb-base-alert>
					<openwb-base-alert subtype="warning">
						<p>
							Es werden alle lokalen Änderungen mit dem Update
							verworfen!
						</p>
						ToDo:
						<ul>
							<li>fetch tags from git</li>
							<li>allow tag selection (no downgrade!)</li>
							<li>release notes?</li>
						</ul>
					</openwb-base-alert>
					<template #footer>
						<div class="row justify-content-center">
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
									@click="sendSystemCommand('systemUpdate')"
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
			<form name="powerForm">
				<openwb-base-card title="Betrieb">
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
									@click="sendSystemCommand('systemReboot')"
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
									@click="sendSystemCommand('systemShutdown')"
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
} from "@fortawesome/free-solid-svg-icons";
library.add(fasArrowAltCircleUp, fasUndo, fasPowerOff, fasDownload);
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
				"openWB/system/current_master_commit",
				"openWB/system/current_missing_commits",
			],
			warningAcknowledged: false,
		};
	},
	computed: {
		updateAvailable() {
			return (
				this.$store.state.mqtt["openWB/system/current_master_commit"] &&
				this.$store.state.mqtt["openWB/system/current_master_commit"] !=
					this.$store.state.mqtt["openWB/system/current_commit"]
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
	},
};
</script>
