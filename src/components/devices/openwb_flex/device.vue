<template>
	<div class="device-openwb-flex">
		<openwb-base-heading>
			Einstellungen für openWB-Flex
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		/>
		<number-input
			title="Port"
			:model-value="configuration.port"
			@update:model-value="
				updateConfiguration($event, 'configuration.port')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceOpenwbFlex",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
