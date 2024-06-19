<template>
	<div class="vehicle-soc-smarteq">
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
				Der Benutzername für die Anmeldung an den Servern.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			id="password"
			name="password"
			title="Kennwort"
			subtype="password"
			:model-value="vehicle.configuration.password"
			@update:model-value="
				updateConfiguration($event, 'configuration.password')
			"
		>
			<template #help>
				Das Passwort für die Anmeldung an den Servern.<br />
				Das Passwort muss leer gelassen werden, wenn die Anmeldung per 2FA/PIN gewünscht
				ist.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="PIN"
			:model-value="!!password ? '' : vehicle.configuration.pin"
			@update:model-value="
				updateConfiguration($event, 'configuration.pin')
			"
		>
			<template #help>
				Die PIN (TAN-Code), die per email übermittelt wird.<br />
				Zum Anfordern eines neuen TAN-Codes "000000" eintragen und im Desktop den
				SOC per Kreispfeil anfordern.<br />
                                Nach Erhalt der email innerhalb 15 min die neue PIN hier eintragen und<br /> 
                                im Desktop den SOC noch einmal per Kreispfeil anfordern.<br />
                                Tipp: Der Ablauf ist einfacher wenn man mit 2 Browser-Fenstern bzw. -Tabs arbeitet. <br />
                                Eines zeigt auf die Fahrzeug-Konfiguration und das andere auf den Desktop.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="VIN"
			required
			:model-value="vehicle.configuration.vin"
			@update:model-value="
				updateConfiguration($event, 'configuration.vin')
			"
		>
			<template #help> Die Fahrgestellnummer des Fahrzeugs. </template>
		</openwb-base-text-input>
		<openwb-base-checkbox-input
			title="use WebSocket"
			:model-value="
				!!password ? false : vehicle.configuration.useWebSocket
			"
			@update:model-value="
				updateConfiguration($event, 'configuration.useWebSocket')
			"
		>
			<template #help>
				Die MB-API-WebSocket Schnittstelle benutzen.<br />
				Die MB-API-WebSocket Schnittstelle ist nur bei Authentisierung
				über PIN möglich!
			</template>
		</openwb-base-checkbox-input>
	</div>
</template>

<script>
export default {
	name: "VehicleSocSmarteq",
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
