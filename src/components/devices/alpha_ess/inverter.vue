<template>
	<div class="device-alphaess-inverter">
		<openwb-base-heading>
			Einstellungen für Alpha ESS Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Version"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'EMS älter als 1.23V' },
				{ value: 1, text: 'EMS 1.23V oder neuer' },
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
	name: "DeviceAlphaessInverter",
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
