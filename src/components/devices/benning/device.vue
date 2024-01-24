<template>
	<div class="device-benning">
		<openwb-base-heading>
			Einstellungen für Benning
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.url"
			@update:model-value="
				updateConfiguration($event, 'configuration.url')
			"
		/>
		
	</div>
</template>

<script>
export default {
	name: "DeviceBenning",
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
