<template>
	<div class="device-siemens">
		<openwb-base-heading>
			Einstellungen für Siemens
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="warning">
			ToDo: Einstellung "IP" von den Komponenten in das Gerät verschieben!
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceSiemens",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		componentId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
