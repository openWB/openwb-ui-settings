<template>
	<div class="device-siemens-bat">
		<openwb-base-heading>
			Einstellungen für Siemens Batteriespeicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Diese Komponente erfordert keine Einstellungen.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceSiemensBat",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
		componentId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
