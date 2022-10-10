<template>
	<div class="device-solaredge-external-inverter">
		<openwb-base-heading>
			Einstellungen für SolarEdge externen Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Diese Komponente nur konfigurieren, wenn ein weiteres Solaredge
			SmartMeter verbaut ist, welches z.B. die Leistung einer vorhandenen
			Bestands-PV-Anlage erfasst. Dieses zusätzliche SmartMeter muss dann
			als "Zähler 2" / "Position 2" im Wechselrichter-Konfigurationsmenü
			konfiguriert sein.
		</openwb-base-alert>
		<openwb-base-number-input
			title="Modbus ID"
			:model-value="configuration.modbus_id"
			min="1"
			max="255"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceSolarEdgeExternalInverter",
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
