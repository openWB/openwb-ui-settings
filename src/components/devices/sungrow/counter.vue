<template>
	<div class="device-sungrow-counter">
		<openwb-base-heading>
			Einstellungen für Sungrow Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Version"
			:options="[
				{ value: 0, text: 'SH (Hybrid)' },
				{ value: 1, text: 'SG (kein Hybrid)' },
				{ value: 2, text: 'SG (kein Hybrid) mit WiNet Dongle' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceSungrowCounter",
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
