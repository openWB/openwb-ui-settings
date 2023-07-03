<template>
	<div class="backup-cloud-nextcloud">
		<openwb-base-heading>
			Einstellungen für NextCloud-Backup Cloud
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Cloud-URL"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		>
			<template #help>
				Die Cloud-URL wird in der Form 'https://nextcloud-url' und
				Benutzername im Eingabefeld oder mit Zugangstoken erwartet. Die
				URL kann je nach NextCloud Installation so
				'https://nextcloud-url/s/user_token' oder so
				'https://nextcloud-url/index.php/s/user_token' aussehen.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Benutzername"
			subtype="user"
			:model-value="configuration.user"
			@update:model-value="
				updateConfiguration($event, 'configuration.user')
			"
		/>
		<openwb-base-text-input
			title="Passwort"
			subtype="password"
			:model-value="configuration.password"
			@update:model-value="
				updateConfiguration($event, 'configuration.password')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "BackupCloudNextCloud",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
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
