<template>
	<div class="device-powerfox-counter">
		<openwb-base-heading>
			Einstellungen für Powerfox Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="ID"
			required
			:model-value="configuration.id"
			@update:model-value="
				updateConfiguration($event, 'configuration.id')
			"
		>
			<template #help>
				Um die ID herauszufinden mit dem Browser die Adresse
				<a
					href="https://backend.powerfox.energy/api/2.0/my/all/devices"
					target="_blank"
					rel="noopener noreferrer"
				>
					https://backend.powerfox.energy/api/2.0/my/all/devices
				</a>
				aufrufen und dort Benutzername und Passwort eingeben. Die Device
				ID ist exakt so einzutragen, wie in der Antwort des Servers. Das
				bedeutet insbesondere auch, die Groß-/KLeinschreibung ist zu
				beachten!
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DevicePowerfoxCounter",
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
