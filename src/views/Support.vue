<template>
	<div class="support">
		<form name="supportForm">
			<openwb-base-alert
				v-if="
					$store.state.mqtt[
						'openWB/system/dataprotection_acknowledged'
					] !== true
				"
				subtype="danger"
			>
				Sie müssen der
				<router-link to="/System/DataProtection">
					Datenschutzerklärung
				</router-link>
				zustimmen, um einen Fehlerbericht senden zu können.
			</openwb-base-alert>
			<div v-else>
				<openwb-base-alert subtype="success">
					Sie haben der
					<router-link to="/System/DataProtection">
						Datenschutzerklärung
					</router-link>
					zugestimmt und können Fehlerberichte senden.
				</openwb-base-alert>
				<openwb-base-card title="Fehlerbericht">
					<div
						v-if="
							$store.state.mqtt['openWB/general/extern'] === true
						"
					>
						<openwb-base-alert subtype="info">
							Diese openWB befindet sich im Modus "Nur Ladepunkt".
							Bitte senden Sie den Fehlerbericht von der regelnden
							openWB.
						</openwb-base-alert>
					</div>
					<div v-else>
						<div
							v-if="
								$store.state.mqtt[
									'openWB/system/dataprotection_acknowledged'
								] === true
							"
						>
							<openwb-base-alert subtype="info">
								Das Sammeln der Systemparameter für die
								Fehlermeldung kann einige Zeit in Anspruch
								nehmen. Es werden keine Benutzernamen oder
								Passwörter aus der Konfigurationsdatei
								übertragen! Der Debug Modus muss nicht verstellt
								werden.
							</openwb-base-alert>
							<openwb-base-text-input
								title="E-Mail"
								required
								subtype="email"
								v-model="sendDebugData.email"
							/>
							<openwb-base-textarea
								title="Fehlerbeschreibung"
								required
								minlength="20"
								maxlength="500"
								v-model="sendDebugData.message"
							/>
						</div>
					</div>
					<template
						#footer
						v-if="
							$store.state.mqtt['openWB/general/extern'] ===
								false &&
							$store.state.mqtt[
								'openWB/system/dataprotection_acknowledged'
							] === true
						"
					>
						<div class="row justify-content-center">
							<openwb-base-click-button
								class="col-4"
								:class="
									enableSendDebugButton
										? 'btn-success'
										: 'btn-outline-success'
								"
								:disabled="!enableSendDebugButton"
								@click="sendDebugMessage"
							>
								Absenden
							</openwb-base-click-button>
						</div>
					</template>
				</openwb-base-card>
				<openwb-base-alert
					v-if="!enableSendDebugButton"
					subtype="success"
				>
					Die Daten für den Fehlerbericht werden im Hintergrund
					zusammengestellt. Sie können diese Seite jetzt verlassen.
					<font-awesome-icon fixed-width :icon="['fas', 'check']" />
				</openwb-base-alert>
			</div>
		</form>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck as fasCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheck);

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "Support",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/system/dataprotection_acknowledged",
			],
			sendDebugData: {
				email: "",
				message: "",
			},
			enableSendDebugButton: true,
		};
	},
	methods: {
		sendDebugMessage() {
			let myForm = document.forms["supportForm"];
			if (!myForm.reportValidity()) {
				console.log("form invalid");
				return;
			} else {
				this.$emit("sendCommand", {
					command: "sendDebug",
					data: this.sendDebugData,
				});
				this.enableSendDebugButton = false;
			}
		},
	},
};
</script>
