<template>
	<openwb-base-card
		v-if="
			this.$store.state.mqtt[
				'openWB/general/ripple_control_receiver/configured'
			]
		"
		subtype="secondary"
		:collapsible="true"
		:collapsed="true"
	>
		<template #header>
			<font-awesome-icon :icon="['fas', 'tower-broadcast']" />
			Steuerbare Verbrauchseinrichtung (RSE)
		</template>
		<openwb-base-alert
			:subtype="
				statusLevel[
					$store.state.mqtt[
						'openWB/general/ripple_control_receiver/get/fault_state'
					]
				]
			"
		>
			<font-awesome-icon
				v-if="
					$store.state.mqtt[
						'openWB/general/ripple_control_receiver/get/fault_state'
					] == 1
				"
				fixed-width
				:icon="['fas', 'exclamation-triangle']"
			/>
			<font-awesome-icon
				v-else-if="
					$store.state.mqtt[
						'openWB/general/ripple_control_receiver/get/fault_state'
					] == 2
				"
				fixed-width
				:icon="['fas', 'times-circle']"
			/>
			<font-awesome-icon
				v-else
				fixed-width
				:icon="['fas', 'check-circle']"
			/>
			Modulmeldung:<br />
			{{
				$store.state.mqtt[
					"openWB/general/ripple_control_receiver/get/fault_str"
				]
			}}
		</openwb-base-alert>
		<openwb-base-text-input
			title="RSE-Kontakt 1"
			readonly
			:model-value="
				$store.state.mqtt[
					'openWB/general/ripple_control_receiver/get/r1_blocking'
				]
					? 'Laden gesperrt'
					: 'Laden erlaubt'
			"
		/>
		<openwb-base-text-input
			title="RSE-Kontakt 2"
			readonly
			:model-value="
				$store.state.mqtt[
					'openWB/general/ripple_control_receiver/get/r2_blocking'
				]
					? 'Laden gesperrt'
					: 'Laden erlaubt'
			"
		/>
	</openwb-base-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCheckCircle as fasCheckCircle,
	faExclamationTriangle as fasExclamationTriangle,
	faTimesCircle as fasTimesCircle,
	faTowerBroadcast as fasTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	fasCheckCircle,
	fasExclamationTriangle,
	fasTimesCircle,
	fasTowerBroadcast
);

export default {
	name: "RippleControlReceiverCard",
	mixins: [ComponentState],
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/ripple_control_receiver/configured",
				"openWB/general/ripple_control_receiver/get/fault_state",
				"openWB/general/ripple_control_receiver/get/fault_str",
				"openWB/general/ripple_control_receiver/get/r1_blocking",
				"openWB/general/ripple_control_receiver/get/r2_blocking",
				"openWB/general/ripple_control_receiver/module",
			],
			statusLevel: ["success", "warning", "danger"],
		};
	},
};
</script>
