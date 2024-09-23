<template>
	<div class="device-discovergy">
		<openwb-base-heading>
			Einstellungen für Discovergy
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Benutzername"
			subtype="user"
			required
			:model-value="configuration.user"
			@update:model-value="
				updateConfiguration($event, 'configuration.user')
			"
		/>
		<openwb-base-text-input
			title="Passwort"
			subtype="password"
			required
			:model-value="configuration.password"
			@update:model-value="
				updateConfiguration($event, 'configuration.password')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceDiscovergy",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
