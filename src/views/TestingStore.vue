<template>
	<div class="testing-store">
		<card title="Felder mit Verknüpfung zu Topics" :collapsible="true">
			<text-input
				title="Uptime"
				disabled="disabled"
				:model-value="$store.state.mqtt['openWB/system/Uptime']"
				@update:model-value="
					updateState('openWB/system/Uptime', $event)
				"
			/>
			<text-input
				title="Version"
				disabled="disabled"
				:model-value="$store.state.mqtt['openWB/system/Version']"
				@update:model-value="
					updateState('openWB/system/Version', $event)
				"
			/>
		</card>

		<card title="Einfache Eingabefelder">
			<text-input
				title="1. Text"
				:model-value="$store.state.examples.text1"
				@update:model-value="updateState('text1', $event)"
			>
				<template #help>Einfacher Text</template>
			</text-input>
			<text-input
				title="2. Text (E-Mail)"
				subtype="email"
				:model-value="$store.state.examples.text2"
				@update:model-value="updateState('text2', $event)"
			>
				<template #help>Eingabefeld für E-Mailadressen</template>
			</text-input>
			<text-input
				title="3. Text (Host)"
				subtype="host"
				:model-value="$store.state.examples.text3"
				@update:model-value="updateState('text3', $event)"
			>
				<template #help>
					Eingabefeld für Hosts (IP oder Namen)
				</template>
			</text-input>
			<text-input
				title="4. Text (URL)"
				subtype="url"
				:model-value="$store.state.examples.text4"
				@update:model-value="updateState('text4', $event)"
			>
				<template #help>Eingabefeld für URLs</template>
			</text-input>
			<text-input
				title="5. Text (User)"
				subtype="user"
				:model-value="$store.state.examples.text5"
				@update:model-value="updateState('text5', $event)"
			>
				<template #help>Eingabefeld für Benutzernamen</template>
			</text-input>
			<text-input
				title="6. Text (Time)"
				subtype="time"
				:model-value="$store.state.examples.text6"
				@update:model-value="updateState('text6', $event)"
			>
				<template #help>Eingabefeld für Zeiten</template>
			</text-input>
			<text-input
				title="7. Text (Date)"
				subtype="date"
				:model-value="$store.state.examples.text7"
				@update:model-value="updateState('text7', $event)"
			>
				<template #help>Eingabefeld für ein Datum</template>
			</text-input>
			<hr />
			<number-input
				title="1. Zahl"
				:min="5"
				:max="9"
				:step="2"
				unit="kW"
				:model-value="$store.state.examples.number1"
				@update:model-value="updateState('number1', $event)"
			>
				<template #help>Zahl mit Einheit</template>
			</number-input>
			<number-input
				title="2. Zahl"
				:min="10"
				:max="32"
				:step="2"
				:model-value="$store.state.examples.number2"
				@update:model-value="updateState('number2', $event)"
			>
				<template #help>Eingabefeld für Zahlen ohne Einheit</template>
			</number-input>
			<text-input
				title="1. Passwort"
				subtype="password"
				:model-value="$store.state.examples.password1"
				@update:model-value="updateState('password1', $event)"
			>
				<template #help>
					Das Passwort kann per Klick auf das Auge angezeigt werden.
				</template>
			</text-input>
			<hr />
			<textarea-input
				title="1. Textarea"
				maxlength="50"
				:model-value="$store.state.examples.textarea1"
				@update:model-value="updateState('textarea1', $event)"
			>
				<template #help>
					Textarea mit maximaler Länge von 50 Zeichen.
				</template>
			</textarea-input>
		</card>

		<card title="Spezielle Elemente">
			<range-input
				title="1. Range"
				:min="6"
				:max="32"
				:step="1"
				unit="A"
				:model-value="$store.state.examples.range1"
				@update:model-value="updateState('range1', $event)"
			>
				<template #help>Range ohne spezielle Labels</template>
			</range-input>
			<range-input
				title="2. Range"
				:min="0"
				:max="11"
				:step="1"
				unit="A"
				:labels="[
					{ label: 'Aus', value: 0 },
					{ label: 6, value: 6 },
					{ label: 7, value: 7 },
					{ label: 8, value: 8 },
					{ label: 9, value: 9 },
					{ label: 10, value: 10 },
					{ label: 11, value: 11 },
					{ label: 12, value: 12 },
					{ label: 13, value: 13 },
					{ label: 14, value: 14 },
					{ label: 15, value: 15 },
					{ label: 16, value: 16 },
				]"
				:model-value="$store.state.examples.range2"
				@update:model-value="updateState('range2', $event)"
			>
				<template #help>Range mit speziellen Labels</template>
			</range-input>
			<hr />
			<select-input
				title="1. Select"
				notSelected="Bitte auswählen"
				:options="[
					{ value: 1, text: 'Eins' },
					{ value: 2, text: 'Zwei' },
				]"
				:model-value="$store.state.examples.select1"
				@update:model-value="updateState('select1', $event)"
			>
				<template #help>Select mit einfachen Optionen</template>
			</select-input>
			<select-input
				title="2. Select"
				:groups="[
					{
						label: 'Gruppe 1 (Number)',
						options: [
							{ value: 1, text: 'Eins' },
							{ value: 2, text: 'Zwei' },
						],
					},
					{
						label: 'Gruppe 2 (String)',
						options: [
							{ value: 'three', text: 'Drei' },
							{ value: 'four', text: 'Vier' },
						],
					},
				]"
				:model-value="$store.state.examples.select2"
				@update:model-value="updateState('select2', $event)"
			>
				<template #help>Select mit Gruppen</template>
			</select-input>
			<hr />
			<button-group-input
				title="1. Button-Group"
				:buttons="[
					{ buttonValue: 1, text: 'Eins' },
					{ buttonValue: 2, text: 'Zwei' },
				]"
				:model-value="$store.state.examples.buttongroup1"
				@update:model-value="updateState('buttongroup1', $event)"
			>
				<template #help>Hilfetext</template>
			</button-group-input>
			<hr />
			<checkbox-input
				title="1. Checkbox"
				:model-value="$store.state.examples.checkbox1"
				@update:model-value="updateState('checkbox1', $event)"
			>
				<template #help>Hilfetext</template>
			</checkbox-input>
		</card>

		<card title="JSON Gruppe">
			<text-input
				title="JSON 1"
				subtype="json"
				:model-value="$store.state.examples.json1"
				@update:model-value="updateState('json1', $event)"
			>
				<template #help>JSON Objekt</template>
			</text-input>
			<text-input
				title="JSON 1 Text"
				:model-value="$store.state.examples.json1.text"
				@update:model-value="updateState('json1', $event, 'text')"
			>
				<template #help>Text im JSON Objekt</template>
			</text-input>
			<number-input
				title="JSON 1 Zahl"
				:model-value="$store.state.examples.json1.number"
				@update:model-value="updateState('json1', $event, 'number')"
			>
				<template #help>Zahl im JSON Objekt</template>
			</number-input>
		</card>

		<card title="Meldungen">
			<template #header>
				<span style="text-decoration: underline; font-style: italic">
					Styled
					<span style="font-weight: initial">Header</span> Slot
				</span>
			</template>
			<heading>Das ist eine Überschrift</heading>
			<alert>Meldung ohne speziellen Subtype.</alert>
			<alert subtype="info">Infomeldung</alert>
			<alert subtype="warning">Warnmeldung</alert>
			<alert subtype="danger">Fehlermeldung</alert>
		</card>

		<card title="Listen">
			<!-- ToDo: Fix: nested lists bypass store commits! -->
			<sortable-list
				title="Liste 1"
				v-model="$store.state.examples.hierarchy1"
			>
				<template #help>
					<pre>{{
						JSON.stringify(
							$store.state.examples.hierarchy1,
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
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import Card from "@/components/Card.vue";
import Alert from "@/components/Alert.vue";
import Heading from "@/components/Heading.vue";
import TextInput from "@/components/TextInput.vue";
import NumberInput from "@/components/NumberInput.vue";
import TextareaInput from "@/components/TextareaInput.vue";
import RangeInput from "@/components/RangeInput.vue";
import SelectInput from "@/components/SelectInput.vue";
import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
import CheckboxInput from "@/components/CheckboxInput.vue";
import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "TestingStore",
	mixins: [ComponentStateMixin],
	components: {
		Card,
		Alert,
		Heading,
		TextInput,
		NumberInput,
		TextareaInput,
		RangeInput,
		SelectInput,
		ButtonGroupInput,
		CheckboxInput,
		SortableList,
		SubmitButtons,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/system/Uptime",
				"openWB/system/Version",
			],
		};
	},
};
</script>
