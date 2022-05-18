<template>
	<div class="device-mqtt-counter">
		<openwb-base-heading>
			Einstellungen für MQTT Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			<ul>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{ componentId }}/get/power</span
					><br />
					Bezugsleistung in Watt, mit Nachkommastellen (Float),
					positiv Bezug, negativ Einspeisung<br />
					Beispiel: <span class="text-info">-123.45</span>
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{ componentId }}/get/imported</span
					><br />
					Bezogene Energie in Wh, mit Nachkommastellen (Float), nur
					positiv<br />
					Beispiel: <span class="text-info">123.45</span>
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{ componentId }}/get/exported</span
					><br />
					Eingespeiste Energie in Wh, mit Nachkommastellen (Float),
					nur positiv<br />
					Beispiel: <span class="text-info">123.45</span>
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{
							componentId
						}}/get/frequency</span
					><br />
					Netzfrequenz in Hz, mit Nachkommastellen (Float)<br />
					Beispiel: <span class="text-info">50.12</span>
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{ componentId }}/get/currents</span
					><br />
					Array mit den Strömen je Phase in Ampere, mit
					Nachkommastellen (Float), positiv Bezug, negativ
					Einspeisung<br />
					Beispiel: <span class="text-info">[1.2,2.3,-2.1]</span>
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{ componentId }}/get/voltages</span
					><br />
					Array mit den Spannungen je Phase in Volt, mit
					Nachkommastellen (Float)<br />
					Beispiel: <span class="text-info">[222.2,223.3,222.3]</span>
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{ componentId }}/get/powers</span
					><br />
					Array mit den Leistungen je Phase in Watt, mit
					Nachkommastellen (Float)<br />
					Beispiel: <span class="text-info">[12.3,23.4,-12.3]</span>
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{
							componentId
						}}/get/power_factors</span
					><br />
					Array mit den Leistungsfaktoren je Phase, mit
					Nachkommastellen (Float), Wertebereich -1 bis 1<br />
					Beispiel: <span class="text-info">[0.95,0.96,-0.95]</span>
				</li>
			</ul>
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
