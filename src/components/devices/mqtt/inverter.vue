<template>
	<div class="device-mqtt-inverter">
		<openwb-base-heading>
			Einstellungen für MQTT Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			<ul>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/pv/{{
							componentId
						}}/get/power</openwb-base-copy-to-clipboard
					><br />
					PV-Leistung in Watt, ohne Nachkommastellen (Integer), nur
					negativ!<br />
					Beispiel: <span class="text-info">-123</span>
				</li>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/pv/{{
							componentId
						}}/get/counter</openwb-base-copy-to-clipboard
					><br />
					Erzeugte Energie in Wh, mit Nachkommastellen (Float), nur
					positiv<br />
					Beispiel: <span class="text-info">123.45</span>
				</li>
			</ul>
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceMqttInverter",
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
