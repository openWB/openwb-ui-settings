<template>
	<div class="device-sigenergy-inverter">
		<openwb-base-heading>
			Einstellungen für Sigenergy Wechselrichter
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
		>
			<template #help>
				Die Standard-Modbus-ID von Sigenergy ist 247
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceSigenergyInverter",
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
