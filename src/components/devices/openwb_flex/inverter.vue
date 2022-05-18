<template>
	<div class="device-openwb-flex-inverter">
		<openwb-base-heading>
			Einstellungen für openWB-Flex Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
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
	name: "DeviceOpenwbFlexInverter",
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
