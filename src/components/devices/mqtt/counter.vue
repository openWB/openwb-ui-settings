<template>
	<div class="device-mqtt">
		<openwb-base-heading>
			Einstellungen für MQTT Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			{{ deviceId }} / {{ componentId }}
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceMqttCounter",
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
