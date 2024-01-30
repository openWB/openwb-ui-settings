<template>
	<div class="device-openwb-flex-consumption-counter">
		<openwb-base-heading>
			Einstellungen für openWB-Flex Verbrauchszähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Zählermodell"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 'sdm120', text: 'SDM120' },
				{ value: 'sdm630', text: 'SDM630/SDM72D-M' },
				{ value: 'b23', text: 'B23' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		/>
		<openwb-base-number-input
			title="Modbus-ID"
			required
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
export default {
	name: "DeviceOpenwbFlexConsumptionCounter",
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
