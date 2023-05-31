<template>
	<div class="device-solar-view-inverter">
		<openwb-base-heading>
			Einstellungen für SolarView Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Kommando für die Abfrage"
			required
			:model-value="configuration.command"
			@update:model-value="
				updateConfiguration($event, 'configuration.command')
			"
		>
			<template #help>
				Kommandos gemäß SolarView-Dokumentation, z.B.: 00* (gesamte
				Anlage), 01* (Wechselrichter 1), 02* (Wechselrichter 2)
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DeviceSolarViewInverter",
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
