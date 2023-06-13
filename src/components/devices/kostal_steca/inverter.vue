<template>
	<div class="device-kostal-steca-inverter">
		<openwb-base-heading>
			Einstellungen für Kostal Piko MP oder Steca Grid Coolcept Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
				<openwb-base-button-group-input
			title="Variante"
			:buttons="[
				{ buttonValue: false, text: 'Kostal Piko MP (non-plus)' },
				{ buttonValue: true, text: 'Kostal Piko MP oder Steca Grid Coolcept' },
			]"
			:model-value="configuration.variant_steca"
			@update:model-value="
				updateConfiguration($event, 'configuration.variant_steca')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceKostalStecaInverter",
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
