<template>
	<div class="device-fallback">
		<openwb-base-alert subtype="warning">
			Es wurde keine Konfigurationsseite für den
			<span v-if="componentType">
				Komponenten-Typ "{{ componentType }}"
			</span>
			<span v-else>Geräte-Typ "{{ deviceType }}"</span>
			gefunden. Die Einstellungen können als JSON direkt bearbeitet
			werden.
		</openwb-base-alert>
		<openwb-base-textarea
			title="Konfiguration"
			subtype="json"
			:model-value="configuration"
			@update:model-value="updateConfiguration($event, 'configuration')"
		>
			<template #help>
				Bitte prüfen Sie, ob die Eingaben richtig interpretiert werden.
			</template>
		</openwb-base-textarea>
		<openwb-base-alert subtype="info">
			<pre>{{ JSON.stringify(configuration, undefined, 2) }}</pre>
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceFallback",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
		deviceType: String,
		componentId: { default: undefined },
		componentType: String,
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
