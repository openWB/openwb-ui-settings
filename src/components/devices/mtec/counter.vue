<template>
	<div class="device-mtec-counter">
		<openwb-base-heading>
			Einstellungen für M-Tec Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			<span class="text-danger">
				M-Tec Zähler geben keine Ströme aus, sodass nur ein
				Lastmanagement anhand der Gesamtleistung, aber nicht
				phasenbasiert möglich ist.
			</span>
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
		>
			<template #help>
				Die Standard Modbus ID von M-Tec ist 247
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceMTecCounter",
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
