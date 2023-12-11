<template>
	<div class="vehicle-soc-tesla">
		<openwb-base-alert subtype="info">
			Beim Anstecken des Fahrzeugs muss der aktuelle SoC über die
			Hauptseite angegeben werden. Anhand des Zählers im Ladepunkt wird
			dann der aktuelle SoC errechnet. Ausschlaggebend für die Qualität
			dieses Moduls sind die beiden Einstellungen "Kapazität der Batterie"
			in dem Fahrzeug-Profil und "Wirkungsgrad der Ladeelektronik".
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "VehicleSocManual",
	emits: ["update:configuration"],
	props: {
		vehicleId: { required: true, type: Number },
		vehicle: { required: true, type: Object },
	},
	data() {
		return {};
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
