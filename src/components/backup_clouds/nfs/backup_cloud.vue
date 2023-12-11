<template>
	<div class="backup-cloud-nfs">
		<openwb-base-text-input
			title="Pfad zum NFS Share"
			pattern="^([^/: ]+):(\/[^/: ]+)+$"
			:model-value="backupCloud.configuration.nfs_share"
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
		backupCloud: { type: Object, required: true },
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
