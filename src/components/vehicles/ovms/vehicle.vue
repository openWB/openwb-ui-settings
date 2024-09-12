<template>
	<div class="vehicle-soc-ovms">
		<openwb-base-text-input
			title="Benutzername"
			required
			subtype="user"
			:model-value="vehicle.configuration.user_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.user_id')
			"
		>
			<template #help>
				Der Benutzername für die Anmeldung am OVMS-Server
				https://ovms.dexters-web.de/.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Kennwort"
			required
			subtype="password"
			:model-value="vehicle.configuration.password"
			@update:model-value="
				updateConfiguration($event, 'configuration.password')
			"
		>
			<template #help>
				Das Passwort für die Anmeldung am OVMS-Server
				https://ovms.dexters-web.de/.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Vehicle Id"
			required
			:model-value="vehicle.configuration.vehicleId"
			@update:model-value="
				updateConfiguration($event, 'configuration.vehicleId')
			"
		>
			<template #help>
				Die Id des Fahrzeugs im OVMS, auch Module Id genannt.
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "VehicleSocOVMS",
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
