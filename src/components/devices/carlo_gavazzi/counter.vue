<template>
	<div class="device-carlogavazzi-counter">
		<openwb-base-heading>
			Einstellungen für Carlo Gavazzi EM24 LAN
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Ausgelesen wird ID 1 auf Port 502. ModbusTCP muss aktiviert sein.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceCarlogavazziCounter",
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
