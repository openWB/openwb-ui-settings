<template>
	<div class="device-kostalplenticore-counter">
		<openwb-base-heading>
			Einstellungen für Kostal Plenticore Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Wenn der Zähler im Hausverbrauchs-Zweig installiert ist, muss die
			Hierarchie wie im
			<a
				href="https://github.com/openWB/core/wiki/Hausverbrauchs-Zähler"
				target="_blank"
				rel="noopener noreferrer"
				>Wiki für Hausverbrauchs-Zähler</a
			>
			beschrieben, angeordnet werden.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceKostalPlenticoreCounter",
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
