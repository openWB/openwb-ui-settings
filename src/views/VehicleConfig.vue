<template>
	<div class="vehicleConfig">
		<form id="myForm">
			<card title="Vorlagen">
				<template #header>
					Vorlagen
					<avatar
						class="bg-success"
						v-if="
							$store.state.mqtt['openWB/general/extern'] === false
						"
						@click="addEvTemplate"
					>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'plus']"
						/>
					</avatar>
				</template>
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<card
						v-for="(template, key) in evTemplates"
						:key="key"
						:title="template.name ? template.name : key"
						:collapsible="true"
						:collapsed="true"
						subtype="primary"
					>
						<template #header v-if="!key.endsWith('/0')">
							{{ template.name ? template.name : key }}
							<avatar
								class="bg-danger"
								v-if="
									$store.state.mqtt[
										'openWB/general/extern'
									] === false
								"
								@click="deleteEvTemplate(key, $event)"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'trash']"
								/>
							</avatar>
						</template>
						<!-- <alert subtype="info">
							Daten der Vorlage:
							<pre>{{ template }}</pre>
						</alert> -->
						<text-input
							title="Bezeichnung"
							:model-value="template.name"
							@update:model-value="
								updateState(key, $event, 'name')
							"
							:disabled="key.endsWith('/0')"
						>
							<template #help v-if="key.endsWith('/0')">
								Die Standard-Vorlage kann nicht umbenannt
								werden.
							</template>
						</text-input>
						<heading>Angaben zum Ladestrom</heading>
						<range-input
							title="Mindeststrom"
							:min="6"
							:max="16"
							:step="1"
							unit="A"
							:model-value="template.min_current"
							@update:model-value="
								updateState(key, $event, 'min_current')
							"
						>
						</range-input>
						<range-input
							title="Maximalstrom 1-phasig"
							:min="6"
							:max="32"
							:step="1"
							unit="A"
							:model-value="template.max_current_one_phase"
							@update:model-value="
								updateState(
									key,
									$event,
									'max_current_one_phase'
								)
							"
						>
						</range-input>
						<range-input
							title="Maximalstrom mehr-phasig"
							:min="6"
							:max="32"
							:step="1"
							unit="A"
							:model-value="template.max_current_multi_phases"
							@update:model-value="
								updateState(
									key,
									$event,
									'max_current_multi_phases'
								)
							"
						>
						</range-input>
						<number-input
							title="Erlaubte Stromabweichung"
							:model-value="template.nominal_difference"
							@update:model-value="
								updateState(key, $event, 'nominal_difference')
							"
						>
						</number-input>
						<heading>Angaben zur Batterie</heading>
						<number-input
							title="Kapazität der Batterie"
							unit="kWh"
							:min="10"
							:step="1"
							:model-value="template.battery_capacity"
							@update:model-value="
								updateState(key, $event, 'battery_capacity')
							"
						>
						</number-input>
						<number-input
							title="Durchschnittsverbrauch"
							unit="kWh&nbsp;/&nbsp;100km"
							:min="0"
							:step="0.1"
							:model-value="template.average_consump"
							@update:model-value="
								updateState(key, $event, 'average_consump')
							"
						>
						</number-input>
						<heading>Angaben zur Handhabung von Phasen</heading>
						<button-group-input
							title="Unterstützte Phasen"
							:buttons="[
								{ buttonValue: 1, text: '1' },
								{ buttonValue: 2, text: '2' },
								{ buttonValue: 3, text: '3' },
							]"
							:model-value="template.max_phases"
							@update:model-value="
								updateState(key, $event, 'max_phases')
							"
						>
						</button-group-input>
						<button-group-input
							title="CP-Unterbrechung"
							:buttons="[
								{
									buttonValue: false,
									text: 'Aus',
									class: 'btn-outline-danger',
								},
								{
									buttonValue: true,
									text: 'An',
									class: 'btn-outline-success',
								},
							]"
							:model-value="template.control_pilot_interruption"
							@update:model-value="
								updateState(
									key,
									$event,
									'control_pilot_interruption'
								)
							"
						>
						</button-group-input>
						<button-group-input
							title="Phasenumschaltung blockieren"
							:buttons="[
								{
									buttonValue: false,
									text: 'Aus',
									class: 'btn-outline-danger',
								},
								{
									buttonValue: true,
									text: 'An',
									class: 'btn-outline-success',
								},
							]"
							:model-value="template.prevent_switch_stop"
							@update:model-value="
								updateState(key, $event, 'prevent_switch_stop')
							"
						>
						</button-group-input>
						<number-input
							title="Pause bei Phasenumschaltung"
							unit="s"
							:min="2"
							:step="1"
							:model-value="template.phase_switch_pause"
							@update:model-value="
								updateState(key, $event, 'phase_switch_pause')
							"
						>
						</number-input>
					</card>
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
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faPlus as fasPlus,
	faTrash as fasTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus, fasTrash);

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import Card from "@/components/Card.vue";
import Alert from "@/components/Alert.vue";
import Heading from "@/components/Heading.vue";
import TextInput from "@/components/TextInput.vue";
import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
import RangeInput from "@/components/RangeInput.vue";
// import SelectInput from "@/components/SelectInput.vue";
import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import ClickButton from "@/components/ClickButton.vue";
import Avatar from "@/components/Avatar.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";
// import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "VehicleConfig",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		Card,
		Alert,
		Heading,
		TextInput,
		NumberInput,
		// TextareaInput,
		RangeInput,
		// SelectInput,
		ButtonGroupInput,
		// ClickButton,
		Avatar,
		// CheckboxInput,
		// SortableList,
		SubmitButtons,
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/vehicle/template/ev_template/+",
			],
		};
	},
	computed: {
		evTemplates: {
			get() {
				return this.getWildcardTopics(
					"openWB/vehicle/template/ev_template/+"
				);
			},
		},
	},
	methods: {
		addEvTemplate(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("requesting new ev template...");
			this.$emit("sendCommand", {
				command: "addEVTemplate",
				data: {},
			});
		},
		deleteEvTemplate(key, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("request removal of ev template '" + key + "'");
			// get trailing characters as index
			let index = key.match(/([^/]+)$/)[0];
			this.$emit("sendCommand", {
				command: "removeEVTemplate",
				data: { id: index },
			});
		},
	},
};
</script>
