<template>
	<div class="backup-cloud-nfs">
		<openwb-base-heading>
			Einstellungen für NFS-Backup Cloud
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Pfad zum NFS Share"
			pattern="^([^/: ]+):(\/[^/: ]+)+$"
			:model-value="configuration.nfs_share"
			@update:model-value="
				updateConfiguration($event, 'configuration.nfs_share')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "BackupCloudNfs",
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
