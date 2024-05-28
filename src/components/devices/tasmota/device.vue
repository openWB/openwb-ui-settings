<template>
	<div class="device-tasmota">
		<openwb-base-heading>
			Einstellungen für Tasmota
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
		<openwb-base-select-input
			title="Phase"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 1, text: '1' },
				{ value: 2, text: '2' },
				{ value: 3, text: '3' }
			]"
			:model-value="configuration.phase"
			@update:model-value="
				updateConfiguration($event, 'configuration.phase')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceTasmota",
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
