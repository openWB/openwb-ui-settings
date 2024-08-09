<template>
	<div class="device-smahm">
		<openwb-base-heading>
			Einstellungen für SMA Home Manager / Energy Meter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Dieses Gerät benötigt keine Einstellungen.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceSmaHm",
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
