<template>
	<div class="device-enphase-inverter">
		<openwb-base-heading>
			Einstellungen für Enphase Envoy / IQ Gateway Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="EID"
			required
			:model-value="configuration.eid"
			@update:model-value="
				updateConfiguration($event, 'configuration.eid')
			"
		>
			<template #help> EID für "production" </template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceEnphaseInverter",
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
