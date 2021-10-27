<template>
	<div class="device-openwb-flex">
		<heading>Einstellungen für openWB-Flex</heading>
		<!-- <text-input
			title="Konfiguration"
			subtype="json"
			disabled
			:model-value="configuration"
		>
			<template #help>JSON Objekt zur Info</template>
		</text-input> -->
		<text-input
			title="IP oder Hostname"
			subtype="host"
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		>
			<template #help>Eingabefeld für Hosts (IP oder Namen)</template>
		</text-input>
		<number-input
			title="Port"
			:model-value="configuration.port"
			@update:model-value="
				updateConfiguration($event, 'configuration.port')
			"
		/>
	</div>
</template>

<script>
// import Alert from "@/components/Alert.vue";
import Heading from "@/components/Heading.vue";
import TextInput from "@/components/TextInput.vue";
import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
// import RangeInput from "@/components/RangeInput.vue";
// import SelectInput from "@/components/SelectInput.vue";
// import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import ClickButton from "@/components/ClickButton.vue";
// import Avatar from "@/components/Avatar.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";

export default {
	name: "DeviceOpenwbFlex",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object },
	},
	components: {
		// Alert,
		Heading,
		TextInput,
		NumberInput,
		// TextareaInput,
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
