<template>
	<div class="device-solis">
		<openwb-base-heading>
			Einstellungen für Solis
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
		/>
		<openwb-base-number-input
			title="Port"
			required
			:min="1"
			:max="65535"
			:model-value="configuration.port"
			@update:model-value="
				updateConfiguration($event, 'configuration.port')
			"
		/>
		<openwb-base-select-input
			title="Version"
			notSelected="Bitte auswählen"
			:options="[
				{
					value: 'inverter',
					text: 'Wechselrichter ohne Speicheranbindung',
				},
				{ value: 'hybrid', text: 'Hybridwechselrichter RHI/S Serie' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceSolis",
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
