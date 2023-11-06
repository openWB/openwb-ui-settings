<template>
	<openwb-base-card subtype="success" :collapsible="true" :collapsed="true">
		<template #header>
			<font-awesome-icon fixed-width :icon="['fas', 'solar-panel']" />
			{{ inverter.name }} (ID: {{ inverter.id }})
		</template>
		<openwb-base-alert
			:subtype="
				statusLevel[
					$store.state.mqtt[
						'openWB/pv/' + inverter.id + '/get/fault_state'
					]
				]
			"
		>
			<font-awesome-icon
				v-if="
					$store.state.mqtt[
						'openWB/pv/' + inverter.id + '/get/fault_state'
					] == 1
				"
				fixed-width
				:icon="['fas', 'exclamation-triangle']"
			/>
			<font-awesome-icon
				v-else-if="
					$store.state.mqtt[
						'openWB/pv/' + inverter.id + '/get/fault_state'
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
				$store.state.mqtt["openWB/pv/" + inverter.id + "/get/fault_str"]
			}}
		</openwb-base-alert>
		<openwb-base-text-input
			title="Zählerstand"
			readonly
			class="text-right text-monospace"
			step="0.001"
			unit="kWh"
			:model-value="
				formatNumberTopic(
					'openWB/pv/' + inverter.id + '/get/exported',
					3,
					3,
					0.001
				)
			"
		/>
		<openwb-base-text-input
			title="Leistung"
			readonly
			class="text-right text-monospace"
			step="0.001"
			unit="kW"
			:model-value="
				formatNumberTopic(
					'openWB/pv/' + inverter.id + '/get/power',
					3,
					3,
					0.001
				)
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
	faSolarPanel as fasSolarPanel,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	fasCheckCircle,
	fasExclamationTriangle,
	fasTimesCircle,
	fasSolarPanel
);

export default {
	name: "InverterCard",
	mixins: [ComponentState],
	components: {
		FontAwesomeIcon,
	},
	props: {
		inverter: Object,
	},
	data() {
		return {
			statusLevel: ["success", "warning", "danger"],
		};
	},
};
</script>
