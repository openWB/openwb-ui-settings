<template>
	<div class="device-mqtt">
		<heading>
			Einstellungen für MQTT
			<span class="small">(Modul: {{ $options.name }})</span>
		</heading>
		<alert subtype="info">
			Das MQTT Modul stellt keine aktive Verbindung her, sondern erwartet,
			dass die Daten an spezielle Topics im Broker gesendet werden.
		</alert>
	</div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import Heading from "@/components/Heading.vue";
// import TextInput from "@/components/TextInput.vue";
// import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
// import RangeInput from "@/components/RangeInput.vue";
// import SelectInput from "@/components/SelectInput.vue";
// import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import ClickButton from "@/components/ClickButton.vue";
// import Avatar from "@/components/Avatar.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";

export default {
	name: "DeviceMqtt",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
	},
	components: {
		Alert,
		Heading,
		// TextInput,
		// NumberInput,
		// // TextareaInput,
		// RangeInput,
		// SelectInput,
		// ButtonGroupInput,
		// ClickButton,
		// Avatar,
		// CheckboxInput,
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
