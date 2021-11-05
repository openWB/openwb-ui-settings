<template>
	<div class="device-mqtt">
		<openwb-base-heading>
			Einstellungen für MQTT
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Das MQTT Modul stellt keine aktive Verbindung her, sondern erwartet,
			dass die Daten an spezielle Topics im Broker gesendet werden.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceMqtt",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
