<template>
	<div class="device-fronius">
		<openwb-base-heading>
			Einstellungen für Fronius
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
		<openwb-base-number-input
			title="Meter ID"
			:model-value="configuration.meter_id"
			min="0"
			max="1"
			@update:model-value="
				updateConfiguration($event, 'configuration.meter_id')
			"
		/>
		<openwb-base-alert subtype="warning">
			ToDo: Einstellung "Meter ID" ist nur für Zähler relevant. In diese
			Komponenten verschieben.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceFronius",
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
