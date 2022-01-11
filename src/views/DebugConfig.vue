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
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFileDownload as fasFileDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasFileDownload);

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "Debugging",
	mixins: [ComponentStateMixin],
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
		};
	},
	methods: {
		loadMainLog(event) {
			event.stopPropagation();
			this.mainLog = "wird aktualisiert...";
			console.log("Loading main.log...");
			this.axios
				.get(
					location.protocol +
						"//" +
						location.host +
						"/openWB/ramdisk/" +
						"main.log"
				)
				.then((response) => {
					this.mainLog = response.data;
				})
				.catch((error) => {
					if (error.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						this.mainLog =
							"A 404 is expected if running node.js dev server!\n" +
							error.response.data;
					} else if (error.request) {
						// The request was made but no response was received
						// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
						// http.ClientRequest in node.js
						this.mainLog = error.request;
					} else {
						// Something happened in setting up the request that triggered an Error
						this.mainLog = error.message;
					}
				});
		},
		loadMqttLog(event) {
			event.stopPropagation();
			this.mqttLog = "wird aktualisiert...";
			console.log("Loading mqtt.log...");
			this.axios
				.get(
					location.protocol +
						"//" +
						location.host +
						"/openWB/ramdisk/" +
						"mqtt.log"
				)
				.then((response) => {
					this.mqttLog = response.data;
				})
				.catch((error) => {
					if (error.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						this.mqttLog =
							"A 404 is expected if running node.js dev server!\n" +
							error.response.data;
					} else if (error.request) {
						// The request was made but no response was received
						// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
						// http.ClientRequest in node.js
						this.mqttLog = error.request;
					} else {
						// Something happened in setting up the request that triggered an Error
						this.mqttLog = error.message;
					}
				});
		},
	},
};
</script>
