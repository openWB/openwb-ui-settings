<template>
	<div class="device-mqtt-bat">
		<openwb-base-heading>
			Einstellungen für MQTT Batteriespeicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			<ul>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/bat/{{
							componentId
						}}/get/power</openwb-base-copy-to-clipboard
					><br />
					Speicherleistung in Watt, ohne Nachkommastellen (Integer),
					positiv Ladung, negativ Entladung<br />
					Beispiel: <span class="text-info">-123</span>
				</li>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/bat/{{
							componentId
						}}/get/imported</openwb-base-copy-to-clipboard
					><br />
					Geladene Energie in Wh, mit Nachkommastellen (Float), nur
					positiv<br />
					Beispiel: <span class="text-info">123.45</span>
				</li>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/bat/{{
							componentId
						}}/get/exported</openwb-base-copy-to-clipboard
					><br />
					Entladene Energie in Wh, mit Nachkommastellen (Float), nur
					positiv<br />
					Beispiel: <span class="text-info">123.45</span>
				</li>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/bat/{{
							componentId
						}}/get/soc</openwb-base-copy-to-clipboard
					><br />
					Ladestand des Speichers, ohne Nachkommastellen (Integer),
					gültige Werte 0 bis 100<br />
					Beispiel: <span class="text-info">95</span>
				</li>
			</ul>
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceMqttBat",
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
