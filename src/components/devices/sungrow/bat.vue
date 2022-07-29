<template>
	<div class="device-sungrow-bat">
		<openwb-base-heading>
			Einstellungen für Sungrow Speicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Geräteadresse"
			required
			:min="1"
			:max="255"
			:model-value="configuration.id"
			@update:model-value="
				updateConfiguration($event, 'configuration.id')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceSungrowBat",
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
