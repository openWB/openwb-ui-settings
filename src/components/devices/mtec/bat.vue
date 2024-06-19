<template>
	<div class="device-mtec-bat">
		<openwb-base-heading>
			Einstellungen für M-Tec Batteriespeicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Generation"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 2, text: 'Gen 2' },
				{ value: 3, text: 'Gen 3' }
			]"
			:model-value="configuration.generation"
			@update:model-value="
				updateConfiguration($event, 'configuration.generation')
			"
		/>
		<openwb-base-number-input
			title="Modbus ID"
			required
			:model-value="configuration.modbus_id"
			min="1"
			max="255"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		>
			<template #help>
				Die Standard Modbus ID von M-Tec ist 247
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceMTecBat",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
		componentId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
