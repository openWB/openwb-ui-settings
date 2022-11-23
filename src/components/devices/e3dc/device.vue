<template>
	<div class="device-e3dc">
		<openwb-base-heading>
			Einstellungen für E3DC
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.address"
			@update:model-value="
				updateConfiguration($event, 'configuration.address')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceE3dc",
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
