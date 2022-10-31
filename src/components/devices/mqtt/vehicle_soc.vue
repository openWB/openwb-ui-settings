<template>
	<div class="vehicle-soc-tesla">
		<openwb-base-heading>
			Einstellungen für Mqtt-SoC
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Die Daten werden immer dann aktualisiert, wenn das Topic gepublished
			wird. Die Abfrageintervalle werden nicht berücksichtigt, da das
			Intervall vom sendenden Client festgelegt wird.
			<ul>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/vehicle/{{
							deviceId
						}}/get/soc</openwb-base-copy-to-clipboard
					><br />
					Fahrzeug-SoC mit Nachkommastellen (Float) oder Ganzzahl<br />
					Beispiel: <span class="text-info">89.5</span>
				</li>
				Optional:
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/vehicle/{{
							deviceId
						}}/get/range</openwb-base-copy-to-clipboard
					><br />
					Reichweite des Fahrzeugs in km mit Nachkommastellen (Float)
					oder Ganzzahl<br />
					Beispiel: <span class="text-info">356.5</span>
				</li>
			</ul>
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "VehicleSocMqtt",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { required: true },
	},
	data() {
		return {
			token: {
				refresh_token: "",
				access_token: "",
				expires_in: 0,
				created_at: 0,
			},
		};
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
