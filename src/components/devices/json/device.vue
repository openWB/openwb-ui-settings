<template>
	<div class="device-json">
		<openwb-base-heading>
			Einstellungen für JSON
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="URL"
			subtype="url"
			required
			:model-value="configuration.url"
			@update:model-value="
				updateConfiguration($event, 'configuration.url')
			"
		>
			<template #help>
				Es wird eine komplette URL erwartet mit Angaben zum Protokoll,
				IP oder Hostnamen, optional einem Port und einem Pfad. Die
				Antwort muss ein json-Objekt sein.<br />
				Beispiel: http://192.168.1.1:8080/json?data=1
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DeviceJson",
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
