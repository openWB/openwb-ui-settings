<template>
	<div class="device-byd-bat">
		<openwb-base-heading>
			Einstellungen für BYD Batteriespeicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Ist der BYD-Speicher am Kostal Plenticore angebunden, ist in diesem
			Fall im Gerät "Kostal Plenticore" die Komponente Speicher zu
			konfigurieren. Der Kostal Plenticore-Wechselrichter stellt alle
			Daten der angeschlossenen Batterie bereit. Die Konfiguration eines
			BYD-Geräts ist nicht erforderlich.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceBYDBat",
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
