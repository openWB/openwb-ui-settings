<template>
	<div class="device-sonnenbatterie-counter">
		<openwb-base-heading>
			Einstellungen für SonnenBatterie Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Mit diesem Modul ist kein Lastmanagement möglich, da keine Ströme
			der einzelnen Phasen gemessen werden.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceSonnenbatterieCounter",
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
