<template>
	<div class="device-solaredge-counter">
		<openwb-base-heading>
			Einstellungen für SolarEdge Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Hierfür muss ein EVU-Zähler am SolarEdge Wechselrichter per Modbus
			angebunden sein. Der Zähler muss an erster Position im
			Wechselrichter konfiguriert sein.
		</openwb-base-alert>
		<openwb-base-number-input
			title="Modbus ID"
			required
			:model-value="configuration.modbus_id"
			min="1"
			max="255"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		/>
		<openwb-base-number-input
			title="Meter ID"
			:model-value="configuration.meter_id"
			min="1"
			max="255"
			@update:model-value="
				updateConfiguration($event, 'configuration.meter_id')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceSolarEdgeCounter",
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
