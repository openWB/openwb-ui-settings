<template>
	<div class="vehicle-soc-psa">
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
		<openwb-base-select-input
			title="Marke"
			required
			notSelected="Bitte auswählen"
			:options="[
				{ value: 'Peugeot', text: 'Peugeot' },
				{ value: 'Citroen', text: 'Citroen' },
				{ value: 'DS', text: 'DS' },
				{ value: 'Opel', text: 'Opel' },
				{ value: 'Vauxhall', text: 'Vauxhall' },
			]"
			:model-value="configuration.manufacturer"
			@update:model-value="
				updateConfiguration($event, 'configuration.manufacturer')
			"
		>
			<template #help> Marke aus des Fahrzeugs.</template>
		</openwb-base-select-input>

		<openwb-base-text-input
			title="VIN"
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
		<openwb-base-text-input
			title="Client ID"
			subtype="user"
			:model-value="configuration.client_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.client_id')
			"
		>
			<template #help>
				Die Client-ID für die Anmeldung an den PSA-Servern, muss
				normalerweise nicht angegeben werden.
			</template>
		</openwb-base-text-input>

		<openwb-base-text-input
			title="Client Secret"
			subtype="password"
			:model-value="configuration.client_secret"
			@update:model-value="
				updateConfiguration($event, 'configuration.client_secret')
			"
		>
			<template #help>
				Das Client-Secret für die Anmeldung an den PSA-Servern, muss
				normalerweise nicht angegeben werden.
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
