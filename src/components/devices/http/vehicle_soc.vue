<template>
	<div class="vehicle-soc-http">
		<openwb-base-heading>
			Einstellungen für Http SoC
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="URL für SoC"
			subtype="url"
			:model-value="configuration.soc_url"
			@update:model-value="
				updateConfiguration($event, 'configuration.soc_url')
			"
		>
			<template #help>
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche den aktuellen
				SoC darstellt.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="URL für die Reichweite"
			subtype="url"
			:model-value="configuration.range_url"
			@update:model-value="
				updateConfiguration($event, 'configuration.range_url')
			"
		>
			<template #help>
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche die aktuelle
				Reichweite darstellt.
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
		deviceId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
