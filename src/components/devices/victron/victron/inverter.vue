<template>
	<div class="device-victron-inverter">
		<openwb-base-heading>
			Einstellungen für Victron Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Modbus ID"
			required
			:model-value="configuration.modbus_id"
			min="1"
			max="255"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		/>
		<openwb-base-button-group-input
			title="MPPT"
			:buttons="[
				{ buttonValue: false, text: 'Nein' },
				{ buttonValue: true, text: 'Ja' },
			]"
			:model-value="configuration.mppt"
			@update:model-value="
				updateConfiguration($event, 'configuration.mppt')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceVictronInverter",
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
