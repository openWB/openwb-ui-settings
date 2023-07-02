<template>
	<div class="vehicle-soc-smarteq">
		<openwb-base-heading>
			Einstellungen für SmartEQ SoC
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Benutzername"
			required
			subtype="user"
			:model-value="configuration.user_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.user_id')
			"
		>
			<template #help>
				Der Benutzername für die Anmeldung an den Servern.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Kennwort"
			required
			subtype="password"
			:model-value="configuration.password"
			@update:model-value="
				updateConfiguration($event, 'configuration.password')
			"
		>
			<template #help>
				Das Passwort für die Anmeldung an den Servern.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="VIN"
			required
			:model-value="configuration.vin"
			@update:model-value="
				updateConfiguration($event, 'configuration.vin')
			"
		>
			<template #help> Die Fahrgestellnummer des Fahrzeugs. </template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "VehicleSocSmarteq",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		vehicleId: { required: true },
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
