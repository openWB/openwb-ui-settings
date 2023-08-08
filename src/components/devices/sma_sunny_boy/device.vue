<template>
	<div class="device-sunnyboy">
		<openwb-base-heading>
			Einstellungen für SMA Sunny Boy/Tripower
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			ModbusTCP muss entweder direkt am Wechselrichter, per Sunny Portal
			oder über das Tool "Sunny Explorer" aktiviert werden. Dies ist
			standardmäßig deaktiviert.
		</openwb-base-alert>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceSunnyBoy",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
