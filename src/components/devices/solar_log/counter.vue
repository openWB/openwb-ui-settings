<template>
	<div class="device-solar_log-counter">
		<openwb-base-heading>
			Einstellungen für Solar-Log Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			<span class="text-danger">
				Solar-Log Zähler geben keine Ströme aus, sodass kein
				Lastmanagement möglich ist.<br />
			</span>
			Solar-Log Zähler sind Hausverbrauchs-Zähler. Um die Werte am
			EVU-Punkt zu ermitteln, muss ein virtueller Zähler konfiguriert
			werden. Eine Beispiel-Konfiguration mit Solar-Log Zähler findest Du
			hier:
			<a
				href="https://openwb.de/main/?page_id=1025"
				target="_blank"
				rel="noopener noreferrer"
			>
				https://openwb.de/main/?page_id=1025
			</a>
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "DeviceSolarLogCounter",
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
