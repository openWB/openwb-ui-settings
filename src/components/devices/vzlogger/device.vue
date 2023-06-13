<template>
	<div class="device-vzlogger">
		<openwb-base-heading>
			Einstellungen für VZLogger
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		>
			<template #help>
			Bei Angabe des Ports muss auch das Schema mit angegeben werden: http://ip:port
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DeviceVZLogger",
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
