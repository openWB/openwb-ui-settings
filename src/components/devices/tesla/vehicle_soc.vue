<template>
	<div class="vehicle-soc-tesla">
		<openwb-base-heading>
			Einstellungen für Tesla SoC
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Fahrzeug-ID"
			required
			:min="0"
			:model-value="configuration.tesla_ev_num"
			@update:model-value="
				updateConfiguration($event, 'configuration.tesla_ev_num')
			"
		>
			<template #help>
				Die ID des Fahrzeugs bei Tesla. Normalerweise "0" bei nur einem
				Fahrzeug im Konto.
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "VehicleSocTesla",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		componentId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
