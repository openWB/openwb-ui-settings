<template>
	<div class="backup-cloud-fallback">
		<openwb-base-alert
			v-if="Object.keys(configuration).length == 0"
			subtype="info"
		>
			Der Backup-Cloud-Typ "{{ backupCloudType }}" bietet keine
			Einstellungen.
		</openwb-base-alert>
		<div v-else>
			<openwb-base-alert subtype="warning">
				Es wurde keine Konfigurationsseite für den Backup-Cloud-Typ "{{
					backupCloudType
				}}" gefunden. Die Einstellungen können als JSON direkt
				bearbeitet werden.
			</openwb-base-alert>
			<openwb-base-textarea
				title="Konfiguration"
				subtype="json"
				:model-value="configuration"
				@update:model-value="
					updateConfiguration($event, 'configuration')
				"
			>
				<template #help>
					Bitte prüfen Sie, ob die Eingaben richtig interpretiert
					werden.
				</template>
			</openwb-base-textarea>
			<openwb-base-alert subtype="info">
				<pre>{{ JSON.stringify(configuration, undefined, 2) }}</pre>
			</openwb-base-alert>
		</div>
	</div>
</template>

<script>
export default {
	name: "BackupCloudConfigFallback",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		backupCloudType: String,
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
