<template>
	<div class="device-discovergy-counter">
		<openwb-base-heading>
			Einstellungen für Discovergy Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Meter-ID"
			required
			:model-value="configuration.meter_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.meter_id')
			"
		>
			<template #help>
				Um die ID herauszufinden mit dem Browser die Adresse
				<a
					href="https://api.discovergy.com/public/v1/meters"
					target="_blank"
					rel="noopener noreferrer"
				>
					https://api.discovergy.com/public/v1/meters
				</a>
				aufrufen und dort Benutzername und Passwort eingeben. Hier wird
				nun u.a. die ID des Zählers angezeigt.
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DeviceDiscovergyCounter",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
		componentId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
