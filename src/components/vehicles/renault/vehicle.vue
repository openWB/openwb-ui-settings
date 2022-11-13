<template>
	<div class="vehicle-soc-renault">
		<openwb-base-heading>
			Einstellungen für Renault SoC
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
				Der Benutzername für die Anmeldung an den Renault-Servern.
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
				Das Passwort für die Anmeldung an den Renault-Servern.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Länderkennung"
			required
			:model-value="configuration.location"
			@update:model-value="
				updateConfiguration($event, 'configuration.location')
			"
		>
			<template #help>
				Länderkennung des Fahrzeugs, z.b. de_DE für Deutschland.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Land"
			required
			:model-value="configuration.location"
			@update:model-value="
				updateConfiguration($event, 'configuration.location')
			"
		>
			<template #help>
				Land des Fahrzeugs, z.b. DE für Deutschland.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="VIN"
			:model-value="configuration.vin"
			@update:model-value="
				updateConfiguration($event, 'configuration.vin')
			"
		>
			<template #help>
				Die Fahrgestellnummer des Fahrzeugs falls mehrere Fahrzeuge im
				Account vorhanden sind.
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "VehicleSocRenault",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		vehicleId: { required: false },
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
