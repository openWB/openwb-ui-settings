<template>
	<div class="device-mqtt">
		<openwb-base-heading>
			Einstellungen für MQTT Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			<ul>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{
							componentId
						}}/get/power_all</span
					><br />
					Bezugsleistung in Watt, mit Nachkommastellen (Float),
					positiv Bezug, negativ Einspeisung
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{ componentId }}/get/imported</span
					><br />
					Bezogene Energie in Wh, mit Nachkommastellen (Float), nur
					positiv
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{ componentId }}/get/exported</span
					><br />
					Eingespeiste Energie in Wh, mit Nachkommastellen (Float),
					nur positiv
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{
							componentId
						}}/get/frequency</span
					><br />
					Netzfrequenz in Hz, mit Nachkommastellen (Float)
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{ componentId }}/get/current</span
					><br />
					Array mit den Strömen je Phase in Ampere, mit
					Nachkommastellen (Float), positiv Bezug, negativ Einspeisung
					"[A1,A2,A3]"
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{ componentId }}/get/voltage</span
					><br />
					Array mit den Spannungen je Phase in Volt, mit
					Nachkommastellen (Float) "[V1,V2,V3]"
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{
							componentId
						}}/get/power_phase</span
					><br />
					Array mit den Leistungen je Phase in Watt, mit
					Nachkommastellen (Float) "[P1,P2,P3]"
				</li>
				<li>
					<span class="text-info"
						>openWB/set/counter/{{
							componentId
						}}/get/power_factor</span
					><br />
					Array mit den Leistungsfaktoren je Phase, mit
					Nachkommastellen (Float), Wertebereich 0 bis 1 "[r1,r2,r3]"
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
