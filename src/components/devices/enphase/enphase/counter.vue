<template>
	<div class="device-enphase-counter">
		<openwb-base-heading>
			Einstellungen für Enphase Envoy / IQ Gateway Zähler
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
			<template #help> EID für "net-consumption" </template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceEnphaseCounter",
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
