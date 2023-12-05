<template>
	<openwb-base-heading>
		Einstellungen für Backup-Cloud Modul "{{ backupCloud.name }}"
	</openwb-base-heading>
	<component
		:is="myComponent"
		:backupCloud="backupCloud"
		@update:configuration="updateConfiguration($event)"
		@sendCommand="sendCommand($event)"
	/>
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbBackupCloudFallback from "./OpenwbBackupCloudConfigFallback.vue";

export default {
	name: "OpenwbBackupCloudProxy",
	emits: ["update:configuration", "sendCommand"],
	props: {
		backupCloud: { type: Object, required: true },
	},
	computed: {
		myComponent() {
			console.debug(`loading backup cloud: ${this.backupCloud.type}`);
			return defineAsyncComponent({
				loader: () =>
					import(`./${this.backupCloud.type}/backup_cloud.vue`),
				errorComponent: OpenwbBackupCloudFallback,
			});
		},
	},
	methods: {
		// event pass through
		updateConfiguration(event) {
			this.$emit("update:configuration", event);
		},
		// event pass through
		sendCommand(event) {
			this.$emit("sendCommand", event);
		},
	},
};
</script>
