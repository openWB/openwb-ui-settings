<template>
	<div class="device-studer-inverter">
		<openwb-base-heading>
			Einstellungen für Studer Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-button-group-input
			title="Typ der MPPT Solarladeregler"
			:buttons="[
				{ buttonValue: 'VT', text: 'Variotrack (VT-40/VT-65/VT-80)' },
				{ buttonValue: 'VS', text: 'VarioString (VS-70/VS-120)' },
			]"
			:model-value="configuration.vc_type"
			@update:model-value="
				updateConfiguration($event, 'configuration.vc_type')
			"
		/>
		<openwb-base-number-input
			title="Anzahl MPPT Solarladeregler"
			required
			:min="1"
			:max="9"
			:model-value="configuration.vc_count"
			@update:model-value="
				updateConfiguration($event, 'configuration.vc_count')
			"
		>
			<template #help>
				Anzahl (1-9) der Studer MPPT Solarladeregler im System (VS/VT)
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceStuderInverter",
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
