<template>
	<div class="device-mqtt">
		<openwb-base-heading>
			Einstellungen für MQTT Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			<ul>
				<li>
					<span class="text-info"
						>openWB/set/pv/{{ componentId }}/get/power</span
					><br />
					PV-Leistung in Watt, ohne Nachkommastellen (Integer), nur
					negativ!
				</li>
				<li>
					<span class="text-info"
						>openWB/set/pv/{{ componentId }}/get/counter</span
					><br />
					Erzeugte Energie in Wh, mit Nachkommastellen (Float), nur
					positiv
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
