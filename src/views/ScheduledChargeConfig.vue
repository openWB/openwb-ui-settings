<template>
	<div class="scheduledChargeConfig">
		<form id="myForm">
			<card title="Phasenumschaltung">
				<button-group-input
					title="Anzahl Phasen"
					:buttons="[
						{ buttonValue: 1, text: '1' },
						{ buttonValue: 3, text: 'Maximum' },
						{ buttonValue: 0, text: 'Automatik' },
					]"
					:model-value="
						$store.state.mqtt[
							'openWB/general/chargemode_config/scheduled_charging/phases_to_use'
						]
					"
					@update:model-value="
						updateState(
							'openWB/general/chargemode_config/scheduled_charging/phases_to_use',
							$event
						)
					"
				>
					<template #help>Hilfetext</template>
				</button-group-input>
			</card>
			<submit-buttons
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
		</form>
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import Card from "@/components/Card.vue";
// import Alert from "@/components/Alert.vue";
// import Heading from "@/components/Heading.vue";
// import TextInput from "@/components/TextInput.vue";
// import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
// import RangeInput from "@/components/RangeInput.vue";
// import SelectInput from "@/components/SelectInput.vue";
import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";
// import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "ScheduledChargeConfig",
	mixins: [ComponentStateMixin],
	components: {
		Card,
		// Alert,
		// Heading,
		// TextInput,
		// NumberInput,
		// TextareaInput,
		// RangeInput,
		// SelectInput,
		ButtonGroupInput,
		// CheckboxInput,
		// SortableList,
		SubmitButtons,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/chargemode_config/scheduled_charging/phases_to_use",
			],
		};
	},
};
</script>
