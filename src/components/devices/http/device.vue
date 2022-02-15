<template>
	<div class="device-http">
		<openwb-base-heading>
			Einstellungen für Http
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.domain"
			@update:model-value="
				updateConfiguration($event, 'configuration.domain')
			"
		/>
		<openwb-base-select-input
			title="Protokoll"
			:options="[
				{ value: 'http', text: 'Unverschlüsselt (http://)' },
				{ value: 'https', text: 'Verschlüsselt (https://)' },
			]"
			:model-value="configuration.protocol"
			@update:model-value="
				updateConfiguration($event, 'configuration.protocol')
			"
		/>
		<openwb-base-alert subtype="warning">
			ToDo: Einstellung "Port" ergänzen.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceHttp",
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
