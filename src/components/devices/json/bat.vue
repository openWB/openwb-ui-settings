<template>
	<div class="device-json-bat">
		<openwb-base-heading>
			Einstellungen für JSON Batteriespeicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Abfrage für Leistung"
			subtype="text"
			required
			:model-value="configuration.jq_power"
			@update:model-value="
				updateConfiguration($event, 'configuration.jq_power')
			"
		/>
		<openwb-base-text-input
			title="Abfrage für Ladestand"
			subtype="text"
			required
			:model-value="configuration.jq_soc"
			@update:model-value="
				updateConfiguration($event, 'configuration.jq_soc')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceJsonBat",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
		componentId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
