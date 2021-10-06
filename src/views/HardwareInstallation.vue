<template>
	<div class="hardwware-installation">
		<form id="myForm">
			<card title="Listen">
				<!-- ToDo: Fix: nested lists bypass store commits! -->
				<sortable-list
					title="Anordnung der Komponenten"
					:model-value="
						$store.state.mqtt['openWB/counter/get/hierarchy']
					"
					@update:model-value="
						updateState('openWB/counter/get/hierarchy', $event)
					"
				>
					<template #help>
						<pre>{{
							JSON.stringify(
								$store.state.mqtt[
									"openWB/counter/get/hierarchy"
								],
								undefined,
								2
							)
						}}</pre>
					</template>
				</sortable-list>
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
// import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";
import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "HardwareInstallation",
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
		// ButtonGroupInput,
		// CheckboxInput,
		SortableList,
		SubmitButtons,
	},
	data() {
		return {
			mqttTopicsToSubscribe: ["openWB/counter/get/hierarchy"],
		};
	},
};
</script>

<style></style>
