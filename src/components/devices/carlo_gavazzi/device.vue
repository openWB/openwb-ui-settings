<template>
	<div class="device-carlogavazzi">
		<openwb-base-heading>
			Einstellungen für Carlo Gavazzi
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
		<openwb-base-alert subtype="warning">
			ToDo: Einstellungen für "Port" ergänzen.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceCarloGavazzi",
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
