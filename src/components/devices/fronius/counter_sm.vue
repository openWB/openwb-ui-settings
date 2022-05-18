<template>
	<div class="device-fronius-counter-sm">
		<openwb-base-heading>
			Einstellungen für Fronius SmartMeter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Meter ID"
			required
			min="0"
			max="65535"
			:model-value="configuration.meter_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.meter_id')
			"
		/>
		<openwb-base-select-input
			title="Kompatibilitätsmodus"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'Aus' },
				{ value: 1, text: 'Variante 1' },
				{ value: 2, text: 'Variante 2' },
			]"
			:model-value="configuration.variant"
			@update:model-value="
				updateConfiguration($event, 'configuration.variant')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceFroniusCounterSM",
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
