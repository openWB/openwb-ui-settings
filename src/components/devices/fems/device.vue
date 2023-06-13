<template>
	<div class="device-fems">
		<openwb-base-heading>
			Einstellungen für openEMS, Fenecon FEMS, Kaco Hy-Control
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
			title="Passwort"
			subtype="password"
			required
			:model-value="configuration.password"
			@update:model-value="
				updateConfiguration($event, 'configuration.password')
			"
		>
			<template #help>
				Bei Nutzung von Fenecon FEMS ist das Passwort im Normalfall user, bei Kaco mit Hy-Control ist das Passwort meist admin.
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DeviceFems",
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
