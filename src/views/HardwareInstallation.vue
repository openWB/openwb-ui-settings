<template>
	<div class="hardware-installation">
		<form id="myForm">
			<card
				title="Systeme und Komponenten"
				:collapsible="true"
				:collapsed="true"
			>
				<select-input
					title="Verfügbare Systeme"
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
						Bitte ein System auswählen, das hinzugefügt werden soll.
					</template>
				</select-input>
				<card
					v-for="installedDevice in $store.state.examples
						.installedDevices"
					v-bind:key="installedDevice.type"
					:title="installedDevice.name"
					:collapsible="true"
					:collapsed="false"
				>
					<avatar class="bg-success">
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'network-wired']"
						/>
					</avatar>
					Gerät: {{ installedDevice.name }} ({{
						installedDevice.type
					}})
				</card>
			</card>
			<card title="Struktur" :collapsible="true" :collapsed="true">
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
import {
	faPlus as fasPlus,
	faNetworkWired as fasNetworfWired,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus, fasNetworfWired);

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
import Avatar from "@/components/Avatar.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";
import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "HardwareInstallation",
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
		Avatar,
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
			this.$emit("sendCommand", {
				command: "addDevice",
				data: {
					type: this.deviceToAdd,
				},
			});
		},
	},
};
</script>

<style></style>
