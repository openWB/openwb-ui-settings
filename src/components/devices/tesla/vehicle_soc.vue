<template>
	<div class="vehicle-soc-tesla">
		<openwb-base-heading>
			Einstellungen für Tesla SoC
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Fahrzeug-ID"
			required
			:min="0"
			:model-value="configuration.tesla_ev_num"
			@update:model-value="
				updateConfiguration($event, 'configuration.tesla_ev_num')
			"
		>
			<template #help>
				Die ID des Fahrzeugs bei Tesla. Normalerweise "0" bei nur einem
				Fahrzeug im Konto.
			</template>
		</openwb-base-number-input>
		<openwb-base-text-input
			title="Access Token"
			pattern="^(ey).*"
			required
			:model-value="
				configuration.token ? configuration.token.access_token : ''
			"
			@update:model-value="
				updateConfiguration($event, 'configuration.token.access_token')
			"
		/>
		<openwb-base-text-input
			title="Refresh Token"
			pattern="^(ey).*"
			required
			:model-value="
				configuration.token ? configuration.token.refresh_token : ''
			"
			@update:model-value="
				updateConfiguration($event, 'configuration.token.refresh_token')
			"
		/>
		<openwb-base-number-input
			title="Erstellt um"
			required
			:model-value="
				configuration.token ? configuration.token.created_at : 0
			"
			@update:model-value="
				updateConfiguration($event, 'configuration.token.created_at')
			"
		>
			<template #help>
				Unix Timestamp des Zeitpunktes, an dem das Token erzeugt wurde.
			</template>
		</openwb-base-number-input>
		<openwb-base-number-input
			title="Ungültig in"
			unit="s"
			required
			:model-value="
				configuration.token ? configuration.token.expires_in : 0
			"
			@update:model-value="
				updateConfiguration($event, 'configuration.token.expires_in')
			"
		>
			<template #help>
				Zeitspanne in Sekunden, nach der das Token ungültig wird.
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "VehicleSocTesla",
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
