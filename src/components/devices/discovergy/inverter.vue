<template>
	<div class="device-discovergy-inverter">
		<openwb-base-heading>
			Einstellungen für Discovergy Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Meter-ID"
			required
			:model-value="configuration.meter_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.meter_id')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceDiscovergyInverter",
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
