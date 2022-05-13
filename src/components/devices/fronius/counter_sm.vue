<template>
	<div class="device-fronius-counter-sm">
		<openwb-base-heading>
			Einstellungen für Fronius SmartMeter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Installationsort"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'EVU-Zweig' },
				{ value: 1, text: 'Hausverbrauchszweig' },
			]"
			:model-value="configuration.meter_location"
			@update:model-value="
				updateConfiguration($event, 'configuration.meter_location')
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
		<openwb-base-alert subtype="warning">
			ToDo: Einstellung "Installationsort" entfernen und durch die
			Hierarchie festlegen.
		</openwb-base-alert>
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
