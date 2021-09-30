<template>
	<div class="testing">
		<form id="myForm">
			<card title="Einfache Eingabefelder">
				<text-input title="1. Text" v-model="text1">
					<template #help>Einfacher Text</template>
				</text-input>
				<text-input
					title="2. Text (E-Mail)"
					subtype="email"
					v-model="text2"
				>
					<template #help>Eingabefeld für E-Mailadressen</template>
				</text-input>
				<text-input
					title="3. Text (Host)"
					subtype="host"
					v-model="text3"
				>
					<template #help>
						Eingabefeld für Hosts (IP oder Namen)
					</template>
				</text-input>
				<text-input title="4. Text (URL)" subtype="url" v-model="text4">
					<template #help>Eingabefeld für URLs</template>
				</text-input>
				<text-input
					title="5. Text (User)"
					subtype="user"
					v-model="text5"
				>
					<template #help>Eingabefeld für Benutzernamen</template>
				</text-input>
				<hr />
				<number-input
					title="1. Zahl"
					:min="5"
					:max="9"
					:step="2"
					unit="kW"
					v-model="number1"
				>
					<template #help>Zahl mit Einheit</template>
				</number-input>
				<number-input
					title="2. Zahl"
					:min="10"
					:max="32"
					:step="2"
					v-model="number2"
				>
					<template #help>
						Eingabefeld für Zahlen ohne Einheit
					</template>
				</number-input>
				<text-input
					title="1. Passwort"
					subtype="password"
					v-model="password1"
				>
					<template #help>
						Das Passwort kann per Klick auf das Auge angezeigt
						werden.
					</template>
				</text-input>
				<hr />
				<textarea-input
					title="1. Textarea"
					v-model="textarea1"
					maxlength="50"
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
					v-model="range1"
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
					v-model="range2"
				>
					<template #help>Range mit speziellen Labels</template>
				</range-input>
				<hr />
				<select-input
					title="1. Select"
					:options="[
						{ value: 1, text: 'Eins' },
						{ value: 2, text: 'Zwei' },
					]"
					v-model="select1"
				>
					<template #help>Select mit einfachen Optionen</template>
				</select-input>
				<select-input
					title="2. Select"
					:groups="[
						{
							label: 'Gruppe 1',
							options: [
								{ value: 1, text: 'Eins' },
								{ value: 2, text: 'Zwei' },
							],
						},
						{
							label: 'Gruppe 2',
							options: [
								{ value: 3, text: 'Drei' },
								{ value: 4, text: 'Vier' },
							],
						},
					]"
					v-model="select2"
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
					v-model="buttongroup1"
				>
					<template #help>Hilfetext</template>
				</button-group-input>
				<hr />
				<checkbox-input title="1. Checkbox" v-model="checkbox1">
					<template #help>Hilfetext</template>
				</checkbox-input>
			</card>

			<card title="JSON Gruppe">
				<text-input title="JSON 1" subtype="json" v-model="json1">
					<template #help>JSON Objekt</template>
				</text-input>
				<text-input title="JSON 1 Text" v-model="json1.text">
					<template #help>Text im JSON Objekt</template>
				</text-input>
				<number-input title="JSON 1 Zahl" v-model="json1.number">
					<template #help>Zahl im JSON Objekt</template>
				</number-input>
			</card>

			<card title="Meldungen">
				<heading>Das ist eine Überschrift</heading>
				<alert>Meldung ohne speziellen Subtype.</alert>
				<alert subtype="info">Infomeldung</alert>
				<alert subtype="warning">Warnmeldung</alert>
				<alert subtype="danger">Fehlermeldung</alert>
			</card>

			<card title="Listen">
				<sortable-list title="Liste 1" v-model="hierarchy1">
					<template #help>
						<pre>{{
							JSON.stringify(hierarchy1, undefined, 2)
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
	data() {
		return {
			text1: "Text...",
			text2: "mail@domain.com",
			text3: "openwb.local",
			text4: "http://www.openwb.de",
			text5: "Benutzername",
			number1: 0,
			number2: 0,
			password1: "GeHeiM!",
			textarea1: "Langer Text...",
			range1: 6,
			range2: 10,
			select1: 1,
			select2: 3,
			buttongroup1: 1,
			checkbox1: true,
			json1: { text: "Text", number: 123 },
			hierarchy1: [
				{
					id: "counter0",
					value: "EVU",
					children: [
						{
							id: "cp1",
							value: "Ladepunkt 1",
							children: [],
						},
						{
							id: "cp2",
							value: "Ladepunkt 2",
							children: [],
						},
						{
							id: "cp3",
							value: "Ladepunkt 3",
							children: [],
						},
					],
				},
			],
		};
	},
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
	emits: ["reset", "defaults", "save"],
};
</script>
