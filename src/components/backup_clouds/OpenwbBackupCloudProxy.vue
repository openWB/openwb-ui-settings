<template>
	<component
		:is="myComponent"
		:configuration="configuration"
		:backupCloudType="backupCloudType"
		@update:configuration="updateConfiguration($event)"
	/>
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbBackupCloudFallback from "./OpenwbBackupCloudConfigFallback.vue";

export default {
	name: "OpenwbBackupCloudProxy",
	emits: ["update:configuration"],
	props: {
		backupCloudType: { type: String, required: true },
		configuration: { type: Object, required: true },
	},
	computed: {
		myComponent() {
			console.debug(`loading backup cloud: ${this.backupCloudType}`);
			return defineAsyncComponent({
				loader: () =>
					import(`./${this.backupCloudType}/backup_cloud.vue`),
				errorComponent: OpenwbBackupCloudFallback,
			});
		},
	},
	methods: {
		updateConfiguration(event) {
			this.$emit("update:configuration", event);
		},
	},
};
</script>
