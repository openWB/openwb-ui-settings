<template>
	<openwb-base-card subtype="success" :collapsible="true" :collapsed="true">
		<template #header>
			<font-awesome-icon fixed-width :icon="['fas', 'solar-panel']" />
			Alle Wechselrichter
		</template>
		<openwb-base-text-input
			title="Zählerstand"
			readonly
			class="text-right text-monospace"
			step="0.001"
			unit="kWh"
			:model-value="
				formatNumberTopic('openWB/pv/get/exported', 3, 3, 0.001)
			"
		/>
		<openwb-base-text-input
			title="Leistung"
			readonly
			class="text-right text-monospace"
			step="0.001"
			unit="kW"
			:model-value="formatNumberTopic('openWB/pv/get/power', 3, 3, 0.001)"
		/>
		<openwb-base-heading>Erträge</openwb-base-heading>
		<openwb-base-text-input
			title="Heute"
			readonly
			class="text-right text-monospace"
			step="0.001"
			unit="kWh"
			:model-value="
				formatNumberTopic('openWB/pv/get/daily_exported', 3, 3, 0.001)
			"
		/>
		<openwb-base-text-input
			title="Dieser Monat"
			readonly
			class="text-right text-monospace"
			step="0.001"
			unit="kWh"
			:model-value="
				formatNumberTopic('openWB/pv/get/monthly_exported', 3, 3, 0.001)
			"
		/>
		<openwb-base-text-input
			title="Dieses Jahr"
			readonly
			class="text-right text-monospace"
			step="0.001"
			unit="kWh"
			:model-value="
				formatNumberTopic('openWB/pv/get/yearly_exported', 3, 3, 0.001)
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
	fasSolarPanel,
);

export default {
	name: "InverterSumCard",
	mixins: [ComponentState],
	components: {
		FontAwesomeIcon,
	},
};
</script>
