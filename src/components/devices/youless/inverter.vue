<template>
	<div class="device-youless-inverter">
		<openwb-base-heading>
			Einstellungen für Youless LS120 Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-button-group-input
			title="S0-Eingang auslesen"
			:buttons="[
				{ buttonValue: false, text: 'nein' },
				{ buttonValue: true, text: 'ja' },
			]"
			:model-value="configuration.source_s0"
			@update:model-value="
				updateConfiguration($event, 'configuration.source_s0')
			"
		>
		</openwb-base-button-group-input>
	</div>
</template>

<script>
export default {
	name: "DeviceYoulessInverter",
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
