<template>
	<div class="device-kostal-sem-counter">
		<openwb-base-heading>
			Einstellungen für Kostal Smart Energy Meter oder TQ EM 410 Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Diese Komponente ist nur richtig, wenn der Zähler NICHT direkt am
			Wechselrichter (Kostal Plenticore) angeschlossen ist und daher
			separat abgefragt werden muss.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceKostalSEMCounter",
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
