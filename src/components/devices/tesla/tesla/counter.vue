<template>
	<div class="device-tesla-counter">
		<openwb-base-heading>
			Einstellungen für Tesla Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Je nach Firmware-Version ist nur ein Lastmanagement anhand der
			Gesamtleistung möglich, da nicht alle Firmware-Versionen
			Phasenströme liefern.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceTeslaCounter",
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
