<template>
	<div class="hardwware-installation">
		<form id="myForm">
			<card title="Geräte und Komponenten">
				<select-input
					title="Verfügbare Geräte"
					notSelected="Bitte auswählen"
					:options="$store.state.examples.availableDevices"
					:model-value="deviceToAdd"
					@update:model-value="deviceToAdd = $event"
				>
					<template #append>
						<span class="col-1">
							<click-button
								class="btn-success"
								:disabled="deviceToAdd === undefined"
								@click="addDevice"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'plus']"
								/>
							</click-button>
						</span>
					</template>
					<template #help>
						Bitte ein Gerät auswählen, das hinzugefügt werden soll.
					</template>
				</select-input>
				<hr />
				<div>
					<p
						v-for="installedDevice in $store.state.examples
							.installedDevices"
						v-bind:key="installedDevice.type"
					>
						Gerät: {{ installedDevice.name }} ({{
							installedDevice.type
						}})
					</p>
				</div>
			</card>
			<card title="Struktur">
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
		SelectInput,
		// ButtonGroupInput,
		ClickButton,
		// CheckboxInput,
		SortableList,
		SubmitButtons,
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: ["openWB/counter/get/hierarchy"],
			deviceToAdd: undefined,
		};
	},
	methods: {
		addDevice() {
			console.log("addDevice:", this.deviceToAdd);
			let updatedInstalledDevices = JSON.parse(
				JSON.stringify(this.$store.state.examples.installedDevices)
			);
			updatedInstalledDevices.push({
				// ToDo: we need some ID (backend?)
				type: this.deviceToAdd,
				name: this.deviceToAdd,
			});
			console.log(updatedInstalledDevices);
			this.updateState("installedDevices", updatedInstalledDevices);
		},
	},
};
</script>

<style></style>
