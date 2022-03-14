<template>
	<div class="power">
		<openwb-base-alert subtype="danger">
			<h2>Achtung!</h2>
			<p>
				Vor allen Aktionen auf dieser Seite ist sicherzustellen, dass
				kein Ladevorgang aktiv ist! Zur Sicherheit bitte zusätzlich alle
				Fahrzeuge von der Ladestation / den Ladestationen abstecken!
			</p>
		</openwb-base-alert>
		<form name="updateForm">
			<openwb-base-card title="Versionsverwaltung">
				<openwb-base-alert subtype="danger">
					Nach einem Update wird die Ladestation direkt neu gestartet!
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
								class="btn-success"
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
					Wenn die Ladestation ausgeschaltet wird, muss sie komplett
					spannungsfrei geschaltet werden. Erst beim erneuten
					Zuschalten der Spannung fährt das System wieder hoch.
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
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faArrowAltCircleUp as fasArrowAltCircleUp,
	faUndo as fasUndo,
	faPowerOff as fasPowerOff,
} from "@fortawesome/free-solid-svg-icons";
library.add(fasArrowAltCircleUp, fasUndo, fasPowerOff);
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "OpenwbSupport",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [],
		};
	},
	methods: {
		sendSystemCommand(command) {
			this.$emit("sendCommand", {
				command: command,
				data: {},
			});
		},
	},
};
</script>
