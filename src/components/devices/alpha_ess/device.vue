<template>
	<div class="device-alphaess">
		<openwb-base-heading>
			Einstellungen für Alpha ESS
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Für dieses Gerät gibt es keine Einstellungen.
		</openwb-base-alert>
		<openwb-base-alert subtype="warning">
			ToDo: Einstellung "Version" von den Komponenten in das Gerät
			verschieben!
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceAlphaess",
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
