<template>
	<div class="device-sma-modbustcp-inverter">
		<openwb-base-heading>
			Einstellungen für SMA Modbus/TCP Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Version"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'Standard' },
				{ value: 1, text: 'Core-2' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceSmaModbustcpInverter",
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
