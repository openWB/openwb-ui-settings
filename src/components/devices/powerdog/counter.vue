<template>
	<div class="device-powerdog-counter">
		<openwb-base-heading>
			Einstellungen für Powerdog Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-button-group-input
			title="Einbau-Position"
			:buttons="[
				{ buttonValue: false, text: 'Hausverbrauch' },
				{ buttonValue: true, text: 'EVU-Punkt' },
			]"
			:model-value="configuration.position_evu"
			@update:model-value="
				updateConfiguration($event, 'configuration.position_evu')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DevicePowerdogCounter",
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
