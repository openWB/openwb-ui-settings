<template>
	<div class="device-victron-counter">
		<openwb-base-heading>
			Einstellungen für Victron Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Modbus-ID"
			:min="1"
			:max="255"
			required
			:model-value="configuration.modbus_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		/>
		<openwb-base-button-group-input
			title="Messgerät"
			:buttons="[
				{ buttonValue: false, text: 'AC-In Victron GX' },
				{ buttonValue: true, text: 'Energy Meter' },
			]"
			:model-value="configuration.energy_meter"
			@update:model-value="
				updateConfiguration($event, 'configuration.energy_meter')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceVictronCounter",
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
