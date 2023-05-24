<template>
	<div
		class="web-theme-fallback"
		v-if="Object.keys(configuration).length > 0"
	>
		<openwb-base-alert subtype="warning">
			Es wurde keine Konfigurationsseite für das Web Theme "{{
				webThemeType
			}}" gefunden. Die Einstellungen können als JSON direkt bearbeitet
			werden.
		</openwb-base-alert>
		<openwb-base-textarea
			title="Theme Konfiguration"
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
	<openwb-base-alert v-else subtype="info">
		Das Web Theme "{{ webThemeType }}" kann nicht angepasst werden.
	</openwb-base-alert>
</template>

<script>
export default {
	name: "WebThemeFallback",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		webThemeType: { type: String },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
