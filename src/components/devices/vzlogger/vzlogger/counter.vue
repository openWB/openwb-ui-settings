<template>
	<div class="device-vzlogger-counter">
		<openwb-base-heading>
			Einstellungen für VZLogger Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Bitte auf der Shell ausführen: "curl -s IPdesVZLogger:Port | jq
			.|cat -n" Zählen, in welcher Zeile der gesuchte Wert steht. Bei der
			ersten Zeile mit 1 anfangen zu zählen.
		</openwb-base-alert>
		<openwb-base-number-input
			title="Zeile der Leistung"
			required
			:min="0"
			:model-value="configuration.line_power"
			@update:model-value="
				updateConfiguration($event, 'configuration.line_power')
			"
		/>
		<openwb-base-number-input
			title="Zeile der Einspeisung"
			:min="0"
			:model-value="configuration.line_exported"
			@update:model-value="
				updateConfiguration($event, 'configuration.line_exported')
			"
		/>
		<openwb-base-number-input
			title="Zeile des Bezugs"
			:min="0"
			:model-value="configuration.line_imported"
			@update:model-value="
				updateConfiguration($event, 'configuration.line_imported')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceVZLoggerCounter",
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
