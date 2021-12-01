<template>
	<div class="device-mqtt">
		<openwb-base-heading>
			Einstellungen für MQTT Batteriespeicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			<ul>
				<li>
					<span class="text-info"
						>openWB/set/bat/{{ componentId }}/power</span
					><br />
					Speicherleistung in Watt, ohne Nachkommastellen (Integer),
					positiv Ladung, negativ Entladung
				</li>
				<li>
					<span class="text-info"
						>openWB/set/bat/{{ componentId }}/imported</span
					><br />
					Geladene Energie in Wh, mit Nachkommastellen (Float), nur
					positiv
				</li>
				<li>
					<span class="text-info"
						>openWB/set/bat/{{ componentId }}/exported</span
					><br />
					Entladene Energie in Wh, mit Nachkommastellen (Float), nur
					positiv
				</li>
				<li>
					<span class="text-info"
						>openWB/set/bat/{{ componentId }}/soc</span
					><br />
					Ladestand des Speichers, ohne Nachkommastellen (Integer),
					Gültige Werte 0 bis 100
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
