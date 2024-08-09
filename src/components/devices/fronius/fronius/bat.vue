<template>
	<div class="device-fronius-bat">
		<openwb-base-heading>
			Einstellungen für Fronius Batteriespeicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Meter ID"
			required
			min="0"
			max="65535"
			:model-value="configuration.meter_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.meter_id')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceFroniusBat",
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
