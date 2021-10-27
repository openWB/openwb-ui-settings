<template>
	<div class="chargepoint-installation">
		<form id="myForm">
			<card title="Ladepunkte" :collapsible="true" :collapsed="true">
				<select-input
					title="Verfügbare Ladepunkte"
					notSelected="Bitte auswählen"
					:options="getChargepointList()"
					:model-value="chargepointToAdd"
					@update:model-value="chargepointToAdd = $event"
				>
					<template #append>
						<span class="col-1">
							<click-button
								:class="
									chargepointToAdd === undefined
										? 'btn-outline-success'
										: 'btn-success'
								"
								:disabled="chargepointToAdd === undefined"
								@click="addChargepoint"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'plus']"
								/>
							</click-button>
						</span>
					</template>
					<template #help>
						Bitte einen Ladepunkt auswählen, der hinzugefügt werden
						soll.
					</template>
				</select-input>
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
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus as fasPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus);

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import Card from "@/components/Card.vue";
// import Alert from "@/components/Alert.vue";
// import Heading from "@/components/Heading.vue";
// import TextInput from "@/components/TextInput.vue";
// import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
// import RangeInput from "@/components/RangeInput.vue";
import SelectInput from "@/components/SelectInput.vue";
// import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
import ClickButton from "@/components/ClickButton.vue";
// import Avatar from "@/components/Avatar.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";
// import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "ChargepointInstallation",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		Card,
		// Alert,
		// Heading,
		// TextInput,
		// NumberInput,
		// TextareaInput,
		// RangeInput,
		SelectInput,
		// ButtonGroupInput,
		ClickButton,
		// Avatar,
		// CheckboxInput,
		// SortableList,
		SubmitButtons,
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [],
			chargepointToAdd: undefined,
		};
	},
	methods: {
		addChargepoint() {
			this.$emit("sendCommand", {
				command: "addChargepoint",
				data: {
					type: this.chargepointToAdd,
				},
			});
		},
		getChargepointList() {
			return this.$store.state.examples.availableChargepoints;
		},
	},
};
</script>

<style></style>
