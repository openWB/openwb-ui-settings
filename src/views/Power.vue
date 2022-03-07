<template>
	<div class="power">
		<form name="powerForm">
			<openwb-base-alert subtype="danger">
				<h2>Achtung!</h2>
				<p>
					Vor allen Aktionen auf dieser Seite ist sicherzustellen,
					dass kein Ladevorgang aktiv ist! Zur Sicherheit bitte
					zusätzlich alle Fahrzeuge von der Ladestation / den
					Ladestationen abstecken!
				</p>
				<p>
					Nach einem Update wird die Ladestation direkt neu gestartet!
				</p>
			</openwb-base-alert>
			<openwb-base-card title="System">
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
				<openwb-base-click-button
					class="btn-warning"
					@click="sendSystemCommand('systemReboot')"
				>
					Neustart
					<font-awesome-icon fixed-width :icon="['fas', 'undo']" />
				</openwb-base-click-button>
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
