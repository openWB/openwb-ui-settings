<template>
	<div class="device-sungrow">
		<openwb-base-heading>
			Einstellungen für Sungrow
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Bitte zur Fehlervermeidung die Firmware des Sungrow Wechselrichters
			und WiNet-S Dongles aktuell halten.
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
		<openwb-base-number-input
			title="Port"
			required
			:min="1"
			:max="65535"
			:model-value="configuration.port"
			@update:model-value="
				updateConfiguration($event, 'configuration.port')
			"
		/>
		<openwb-base-number-input
			title="Geräteadresse"
			required
			:min="1"
			:max="255"
			:model-value="configuration.modbus_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		/>
		<openwb-base-select-input
			title="Version"
			:options="[
				{ value: 0, text: 'SH (Hybrid)' },
				{ value: 1, text: 'SH (Hybrid) über WiNet-S Dongle' },
				{ value: 2, text: 'SG (kein Hybrid)' },
				{ value: 3, text: 'SG (kein Hybrid) über WiNet-S Dongle' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		>
			<template #help>
				Die Variante SH sollte möglichst über den internen LAN-Port
				genutzt werden (befindet sich am Wechselrichter hinter dem
				WiNet-S Dongle), da nur hier die netto AC-Leistung ausgelesen
				werden kann. Den WiNet-S Dongle zusätzlich ins Heimnetz (per
				Lan oder Wlan) einbinden, um iSolarCloud nutzen zu können.
				Wird der Dongle auch für openWB genutzt, kann nur die brutto
				DC-Leistung angezeigt werden. In diesem Fall muss das Gerät
				wie ein nicht-hybrider Wechselrichter in der Struktur unter
				"Lastmanagement" eingerichtet werden, mit dem Nachteil, dass
				Gesamt-PV-Leistung und Zählerstände ungenau angezeigt werden.
			</template>
		</openwb-base-select-input>
	</div>
</template>

<script>
export default {
	name: "DeviceSungrow",
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
