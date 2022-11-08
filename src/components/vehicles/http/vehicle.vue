<template>
	<div class="vehicle-soc-http">
		<openwb-base-heading>
			Einstellungen für HTTP SoC
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="SoC URL"
			subtype="url"
			required
			:model-value="configuration.soc_url"
			@update:model-value="
				updateConfiguration($event, 'configuration.soc_url')
			"
		>
			<template #help>
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche den aktuellen
				Ladestand in Prozent (0 bis 100) zurückgibt.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Reichweiten URL"
			subtype="url"
			:model-value="configuration.range_url"
			@update:model-value="
				updateConfiguration($event, 'configuration.range_url')
			"
		>
			<template #help>
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche die aktuelle
				Reichweite in Kilometern darstellt. Diese Angabe ist optional.
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "VehicleSocHttp",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		vehicleId: { required: true },
	},
	data() {
		return {};
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
