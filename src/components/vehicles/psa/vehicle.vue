<template>
	<div class="vehicle-soc-psa">
		<openwb-base-alert subtype="danger">
			Diese Modul ist seit Änderungen der Schnittstellen durch PSA nicht
			mehr funktionsfähig und wird in einer zukünftigen Version entfernt.
			Bitte auf einen anderen Anbieter wechseln, z.B. Tronity.<br />
			Bei vorhandener PSA-Integration in Heimautomation kann der SoC ggf.
			auch per MQTT übergeben werden.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "VehicleSocPSA",
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
