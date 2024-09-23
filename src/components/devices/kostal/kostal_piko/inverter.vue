<template>
	<div class="device-kostalpiko-inverter">
		<openwb-base-heading>
			Einstellungen für Kostal Piko Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-button-group-input
			title="Speicher"
			:buttons="[
				{ buttonValue: false, text: 'nicht vorhanden' },
				{ buttonValue: true, text: 'vorhanden' },
			]"
			:model-value="configuration.bat_configured"
			@update:model-value="
				updateConfiguration($event, 'configuration.bat_configured')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceKostalPikoInverter",
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
