<template>
	<div class="device-json-counter">
		<openwb-base-heading>
			Einstellungen für JSON Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Abfrage für Leistung"
			subtype="text"
			required
			:model-value="configuration.jq_power"
			@update:model-value="
				updateConfiguration($event, 'configuration.jq_power')
			"
		/>
		<openwb-base-text-input
			title="Abfrage für Zählerstand Bezug"
			subtype="text"
			:model-value="configuration.jq_imported"
			@update:model-value="
				updateConfiguration($event, 'configuration.jq_imported')
			"
		>
			<template #help>
				Wird dieses Feld leer gelassen, dann werden Zählerstände intern
				simuliert.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Abfrage für Zählerstand Einspeisung"
			subtype="text"
			:model-value="configuration.jq_exported"
			@update:model-value="
				updateConfiguration($event, 'configuration.jq_exported')
			"
		>
			<template #help>
				Wird dieses Feld leer gelassen, dann werden Zählerstände intern
				simuliert.
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DeviceJsonCounter",
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
