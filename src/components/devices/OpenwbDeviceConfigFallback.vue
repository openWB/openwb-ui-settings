<template>
	<div class="device-fallback">
		<openwb-base-alert
			v-if="Object.keys(configuration).length == 0"
			subtype="info"
		>
			<span v-if="component">
				Der Komponenten-Typ "{{ component.type }}"
			</span>
			<span v-else>Der Gerät-Typ "{{ device.type }}"</span>
			bietet keine Einstellungen.
		</openwb-base-alert>
		<div v-else>
			<openwb-base-alert subtype="warning">
				Es wurde keine Konfigurationsseite für den
				<span v-if="component">
					Komponenten-Typ "{{ component.type }}"
				</span>
				<span v-else>Geräte-Typ "{{ device.type }}"</span>
				gefunden. Die Einstellungen können als JSON direkt bearbeitet
				werden.
			</openwb-base-alert>
			<openwb-base-textarea
				title="Konfiguration"
				subtype="json"
				:model-value="configuration"
				@update:model-value="
					updateConfiguration($event, 'configuration')
				"
			>
				<template #help>
					Bitte prüfen Sie, ob die Eingaben richtig interpretiert
					werden.
				</template>
			</openwb-base-textarea>
			<openwb-base-alert subtype="info">
				<pre>{{ JSON.stringify(configuration, undefined, 2) }}</pre>
			</openwb-base-alert>
		</div>
	</div>
</template>

<script>
export default {
	name: "DeviceFallback",
	emits: ["update:configuration"],
	props: {
		device: { type: Object, required: true },
		component: { type: Object, required: false, default: undefined },
	},
	computed: {
		configuration() {
			return this.component !== undefined
				? this.component.configuration
				: this.device.configuration;
		},
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
