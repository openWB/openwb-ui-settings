<template>
	<div class="device-goodwe">
		<openwb-base-heading>
			Einstellungen für GoodWe
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			ModbusTCP über den LAN-Dongle funktioniert nur bei kleinen
			Wechselrichter-Modellen bis 15kW. Bei den größeren ist ein
			RS485/LAN-Konverter erforderlich.
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
			title="Modbus ID"
			:model-value="configuration.modbus_id"
			min="1"
			max="255"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		/>
		<openwb-base-select-input
			title="Version"
			notSelected="Bitte auswählen"
			:options="[
				{
					value: 'v_1_7',
					text: 'ET/EH/BH/EHB/AES/ABP/BTC Series Ver 1.7',
				},
				{
					value: 'v_1_10',
					text: 'ET(bis 15)/EH/BH/EHB/AES/ABP/BTC Series Ver 1.10, E G2/ET(15-30) Series Ver 1.0',
				},
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		>
			<template #help>
				Zwischen Version 1.7 und 1.10 hat sich das Register für die
				Speicherleistung geändert. Wenn die Speicherleistung nicht
				korrekt ausgelesen wird, bitte die andere Version testen.
			</template>
		</openwb-base-select-input>
	</div>
</template>

<script>
export default {
	name: "DeviceGoodWe",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
