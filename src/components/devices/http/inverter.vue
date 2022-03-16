<template>
	<div class="device-http-inverter">
		<openwb-base-heading>
			Einstellungen für Http Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Pfad für Leistung"
			subtype="text"
			required
			pattern="^/[-a-zA-Z0-9@:%_\+.~#?&/=]*"
			:model-value="configuration.power_path"
			@update:model-value="
				updateConfiguration($event, 'configuration.power_path')
			"
		>
			<template #help>
				Diese Angabe wird an die IP bzw. den Hostnamen angehängt und
				muss mit einem Schrägstrich "/" beginnen.<br />
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche die aktuelle
				Leistung in Watt darstellt.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Pfad für Zählerstand Erzeugung"
			subtype="text"
			required
			pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)|none"
			:model-value="configuration.counter_path"
			@update:model-value="
				updateConfiguration($event, 'configuration.counter_path')
			"
		>
			<template #help>
				Diese Angabe wird an die IP bzw. den Hostnamen angehängt und
				muss mit einem Schrägstrich "/" beginnen.<br />
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche den aktuellen
				absoluten Zählerstand in kWh darstellt.<br />
				Wird hier "none" eingetragen, wird der Zählerstand intern
				simuliert.
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DeviceHttpInverter",
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
