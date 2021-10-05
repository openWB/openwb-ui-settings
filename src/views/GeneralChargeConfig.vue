<template>
	<div class="generalChargeConfig">
		<form id="myForm">
			<card title="Allgemein">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<button-group-input
						title="Lademodus"
						:buttons="[
							{ buttonValue: false, text: 'Einheitlich' },
							{ buttonValue: true, text: 'Individuell' },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/individual_mode'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/individual_mode',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</button-group-input>
					<hr />
					<button-group-input
						title="Begrenzung der Schieflast"
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
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/unbalanced_load'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/unbalanced_load',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</button-group-input>
					<range-input
						v-if="
							$store.state.mqtt[
								'openWB/general/chargemode_config/unbalanced_load'
							]
						"
						title="Erlaubte Schieflast"
						:min="10"
						:max="32"
						:step="1"
						unit="A"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/unbalanced_load_limit'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/unbalanced_load_limit',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</range-input>
				</div>
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
import Alert from "@/components/Alert.vue";
// import Heading from "@/components/Heading.vue";
// import TextInput from "@/components/TextInput.vue";
// import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
import RangeInput from "@/components/RangeInput.vue";
// import SelectInput from "@/components/SelectInput.vue";
import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";
// import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "GeneralChargeConfig",
	mixins: [ComponentStateMixin],
	components: {
		Card,
		Alert,
		// Heading,
		// TextInput,
		// NumberInput,
		// TextareaInput,
		RangeInput,
		// SelectInput,
		ButtonGroupInput,
		// CheckboxInput,
		// SortableList,
		SubmitButtons,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/general/chargemode_config/individual_mode",
				"openWB/general/chargemode_config/unbalanced_load",
				"openWB/general/chargemode_config/unbalanced_load_limit",
			],
		};
	},
};
</script>
