<template>
	<div class="backup-cloud-samba">
		<openwb-base-heading>
			Einstellungen für Samba-Backup Cloud
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Server"
			required
			:model-value="configuration.smb_server"
			@update:model-value="
				updateConfiguration($event, 'configuration.smb_server')
			"
		/>
		<openwb-base-text-input
			title="Freigabe"
			required
			:model-value="configuration.smb_share"
			@update:model-value="
				updateConfiguration($event, 'configuration.smb_share')
			"
		/>
		<openwb-base-text-input
			title="Unterordner (optional)"
			:model-value="configuration.smb_path"
			@update:model-value="
				updateConfiguration($event, 'configuration.smb_path')
			"
		/>
		<openwb-base-text-input
			title="Benutzer"
			:model-value="configuration.smb_user"
			@update:model-value="
				updateConfiguration($event, 'configuration.smb_user')
			"
		/>
		<openwb-base-text-input
			title="Kennwort"
			subtype="password"
			:model-value="configuration.smb_password"
			@update:model-value="
				updateConfiguration($event, 'configuration.smb_password')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "BackupCloudSamba",
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
