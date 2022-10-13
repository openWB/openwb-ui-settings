<template>
	<div class="device-enphase">
		<openwb-base-heading>
			Einstellungen für Enphase Envoy / IQ Gateway
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Geräte mit Firmware-Versionen 7.0 oder neuer werden derzeit nicht
			unterstützt.
		</openwb-base-alert>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.hostname"
			@update:model-value="
				updateConfiguration($event, 'configuration.hostname')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceEnphase",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		componentId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
