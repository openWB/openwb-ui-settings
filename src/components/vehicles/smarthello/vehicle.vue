<template>
	<div class="vehicle-soc-smarthello">
		<openwb-base-text-input
			title="Benutzername"
			subtype="text"
			required
			:model-value="vehicle.configuration.user_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.user_id')
			"
		>
			<template #help> Benutzername für Smart Hello. </template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Kennwort"
			subtype="password"
			required
			:model-value="vehicle.configuration.password"
			@update:model-value="
				updateConfiguration($event, 'configuration.password')
			"
		>
			<template #help> Kennwort für Smart Hello. </template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="VIN"
			subtype="text"
			:model-value="vehicle.configuration.VIN"
			@update:model-value="
				updateConfiguration($event, 'configuration.VIN')
			"
		>
			<template #help>
				Fahrgestellnummer (VIN) des Fahrzeugs. Notwendig falls mehrere
				Fahrzeuge im Account des Herstellers vorhanden sind.
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "VehicleSocSmarthello",
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
