<template>
	<div class="device-janitza-counter">
		<openwb-base-heading>
			Einstellungen für Janitza Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			ModbusTCP muss im Janitza auf Port 502 aktiv und die ID auf "1"
			eingestellt sein.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceJanitzaCounter",
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
