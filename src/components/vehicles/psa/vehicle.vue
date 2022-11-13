<template>
	<div class="vehicle-soc-vwid">
		<openwb-base-heading>
			Einstellungen für PSA SoC
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
				Der Benutzername für die Anmeldung an den PSA-Servern.
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
				Das Passwort für die Anmeldung an den PSA-Servern.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="client-ID"
			required
			subtype="user"
			:model-value="configuration.client_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.client_id')
			"
		>
			<template #help>
				Die Client-ID für die Anmeldung an den PSA-Servern, muss
				normalerweise nicht geändert werden.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Client Secret"
			required
			subtype="password"
			:model-value="configuration.client_secret"
			@update:model-value="
				updateConfiguration($event, 'configuration.client_secret')
			"
		>
			<template #help>
				Das Client-Secret für die Anmeldung an den PSA-Servern, muss
				normalerweise nicht geändert werden.
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
			<template #help>
				Die Fahrgestellnummer des Fahrzeugs. Nur notwendig falls mehrere
				Fahrzeuge im selben Account vorhanden sind.
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "VehicleSocPSA",
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
