<template>
	<div class="device-openwb-flex-counter">
		<heading>
			Einstellungen für openWB-Flex Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</heading>
		<select-input
			title="Zählermodell"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'MPM3PM' },
				{ value: 1, text: 'Lovato' },
				{ value: 2, text: 'SDM630' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		/>
		<number-input
			title="Modbus-ID"
			:min="1"
			:max="255"
			:model-value="configuration.id"
			@update:model-value="
				updateConfiguration($event, 'configuration.id')
			"
		/>
	</div>
</template>

<script>
// import Alert from "@/components/Alert.vue";
import Heading from "@/components/Heading.vue";
// import TextInput from "@/components/TextInput.vue";
import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
// import RangeInput from "@/components/RangeInput.vue";
import SelectInput from "@/components/SelectInput.vue";
// import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import ClickButton from "@/components/ClickButton.vue";
// import Avatar from "@/components/Avatar.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";

export default {
	name: "DeviceOpenwbFlexCounter",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
	},
	components: {
		// Alert,
		Heading,
		// TextInput,
		NumberInput,
		// TextareaInput,
		// RangeInput,
		SelectInput,
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
