<template>
	<div class="device-json-inverter">
		<openwb-base-heading>
			Einstellungen für JSON Wechselrichter
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
			title="Abfrage für Zählerstand"
			subtype="text"
			required
			:model-value="configuration.jq_counter"
			@update:model-value="
				updateConfiguration($event, 'configuration.jq_counter')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceJsonInverter",
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
