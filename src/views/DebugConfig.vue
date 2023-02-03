<template>
	<div class="debugging">
		<form name="debugConfigForm">
			<openwb-base-card title="Protokollierung">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Debug Level"
						:buttons="[
							{ buttonValue: 30, text: 'Warnungen und Fehler' },
							{ buttonValue: 20, text: 'Info' },
							{ buttonValue: 10, text: 'Details' },
						]"
						:model-value="
							$store.state.mqtt['openWB/system/debug_level']
						"
						@update:model-value="
							updateState('openWB/system/debug_level', $event)
						"
					>
						<template #help>
							Wenn der Debug Level auf "Info" oder "Details"
							gesetzt wird, werden mehr Informationen in die
							Logdateien geschrieben. Im normalen Betrieb sollte
							immer "Warnungen und Fehler" gewählt werden, um die
							Schreibvorgänge auf der SD-Karte zu reduzieren.
						</template>
					</openwb-base-button-group-input>
					<openwb-base-alert subtype="warning">
						Achtung! In den Einstellungen "Info" und "Details"
						können in den Logdateien sensible Daten wie
						Benutzernamen und Kennwörter enthalten sein. Diese
						sollten vor dem Veröffentlichen z.B. im Forum
						unkenntlich gemacht werden. Private IP-Adressen (z.B.
						192.168.x.x) müssen nicht maskiert werden, da diese
						nicht über das Internet erreichbar sind.
					</openwb-base-alert>
				</div>
			</openwb-base-card>
			<openwb-base-submit-buttons
				formName="debugConfigForm"
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
		</form>
		<openwb-base-card
			title="Main.log"
			class="mt-3"
			:collapsible="true"
			:collapsed="true"
		>
			<template #actions>
				<openwb-base-avatar
					class="bg-success clickable"
					@click="loadMainLog($event)"
				>
					<font-awesome-icon
						fixed-width
						:icon="['fas', 'file-download']"
					/>
				</openwb-base-avatar>
			</template>
			<pre>{{ mainLog }}</pre>
		</openwb-base-card>
		<openwb-base-card
			title="Mqtt.log"
			class="mt-3"
			:collapsible="true"
			:collapsed="true"
		>
			<template #actions>
				<openwb-base-avatar
					class="bg-success clickable"
					@click="loadMqttLog($event)"
				>
					<font-awesome-icon
						fixed-width
						:icon="['fas', 'file-download']"
					/>
				</openwb-base-avatar>
			</template>
			<pre>{{ mqttLog }}</pre>
		</openwb-base-card>
		<openwb-base-card
			title="Soc.log"
			class="mt-3"
			:collapsible="true"
			:collapsed="true"
		>
			<template #actions>
				<openwb-base-avatar
					class="bg-success clickable"
					@click="loadSocLog($event)"
				>
					<font-awesome-icon
						fixed-width
						:icon="['fas', 'file-download']"
					/>
				</openwb-base-avatar>
			</template>
			<pre>{{ socLog }}</pre>
		</openwb-base-card>
		<openwb-base-card
			title="Protokoll des letzten Updates"
			class="mt-3"
			:collapsible="true"
			:collapsed="true"
		>
			<template #actions>
				<openwb-base-avatar
					class="bg-success clickable"
					@click="loadUpdateLog($event)"
				>
					<font-awesome-icon
						fixed-width
						:icon="['fas', 'file-download']"
					/>
				</openwb-base-avatar>
			</template>
			<pre>{{ updateLog }}</pre>
		</openwb-base-card>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFileDownload as fasFileDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasFileDownload);

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
	name: "OpenwbDebugging",
	mixins: [ComponentState],
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/system/debug_level",
			],
			mainLog: "-- noch nicht geladen --",
			mqttLog: "-- noch nicht geladen --",
			socLog: "-- noch nicht geladen --",
			updateLog: "-- noch nicht geladen --",
		};
	},
	methods: {
		async getFilePromise(myFile) {
			return this.axios
				.get(location.protocol + "//" + location.host + myFile)
				.then((response) => {
					return response.data;
				})
				.catch((error) => {
					if (error.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						return (
							"A 404 is expected if running node.js dev server!\n" +
							error.response.data
						);
					} else if (error.request) {
						// The request was made but no response was received
						// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
						// http.ClientRequest in node.js
						return error.request;
					} else {
						// Something happened in setting up the request that triggered an Error
						return error.message;
					}
				});
		},
		loadMainLog(event) {
			event.stopPropagation();
			this.mainLog = "wird aktualisiert...";
			this.getFilePromise("/openWB/ramdisk/main.log").then((result) => {
				this.mainLog = result;
			});
		},
		loadMqttLog(event) {
			event.stopPropagation();
			this.mqttLog = "wird aktualisiert...";
			this.getFilePromise("/openWB/ramdisk/mqtt.log").then((result) => {
				this.mqttLog = result;
			});
		},
		loadSocLog(event) {
			event.stopPropagation();
			this.socLog = "wird aktualisiert...";
			this.getFilePromise("/openWB/ramdisk/soc.log").then((result) => {
				this.socLog = result;
			});
		},
		loadUpdateLog(event) {
			event.stopPropagation();
			this.updateLog = "wird aktualisiert...";
			this.getFilePromise("/openWB/data/log/update.log").then(
				(result) => {
					this.updateLog = result;
				}
			);
		},
	},
};
</script>
