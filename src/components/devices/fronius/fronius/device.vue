<template>
	<div class="device-fronius">
		<openwb-base-heading>
			Einstellungen für Fronius
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Die Fronius API muss aktiviert sein.<br />
			Sind nur Symos in Nutzung, welche über Fronius Solar Net / DATCOM
			miteinander verbunden sind, muss nur ein Gerät mit einer Komponente
			Wechselrichter angelegt werden. Sind aber z.B. Symo und Symo Hybrid
			im Einsatz, muss für jeden Wechselrichter ein Gerät mit einer
			Komponente Wechselrichter angelegt werden. Die Zähler-Komponente für
			das Smart-Meter wird in dem Gerät angelegt, dass den Wechselrichter
			enthält, an den das SmartMeter angeschlossen ist.
		</openwb-base-alert>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceFronius",
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
