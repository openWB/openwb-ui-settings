<template>
	<div class="device-byd">
		<openwb-base-heading>
			Einstellungen für BYD
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		/>
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
	name: "DeviceBYD",
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
