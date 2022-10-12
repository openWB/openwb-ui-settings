<template>
	<div class="device-smahm-inverter">
		<openwb-base-heading>
			Einstellungen für SMA-HM/EM Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Dies ist nur die richtige Komponente, wenn ein extra EnergyMeter
			ausschließlich für die PV-Messung vorhanden ist. Wenn nur ein
			HomeManager vorhanden ist, muss ein Gerät "SMA Sunny Boy" mit der
			entsprechenden Wechselrichter-Komponente angelegt werden.
		</openwb-base-alert>
		<openwb-base-number-input
			title="Seriennummer"
			required
			:model-value="configuration.serials"
			@update:model-value="
				updateConfiguration($event, 'configuration.serials')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceSmahmInverter",
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
