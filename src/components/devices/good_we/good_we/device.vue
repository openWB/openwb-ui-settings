<template>
	<div class="device-goodwe">
		<openwb-base-heading>
			Einstellungen für GoodWe
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			GoodWe-Wechselrichter verfügen über 2 Dongel: WiFi und Wifi/Lan. Die
			Einbindung über dieses Modul ist nur mit dem Wifi/Lan-Dongle
			möglich.
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
			title="Modbus ID"
			required
			:model-value="configuration.modbus_id"
			min="1"
			max="255"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		/>
		<openwb-base-select-input
			title="API-Version"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 'v_1_7', text: 'v1.7' },
				{ value: 'v_1_1', text: 'v1.0/ v1.1' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		>
			<template #help>
				Die Wahl der API-Version beeinflusst die Auslesung der
				Speicherleistung und der Import/ Export Werte des Zählers.
			</template>
		</openwb-base-select-input>
		<openwb-base-select-input
			title="Firmware"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 8, text: 'ARM < 9.0' },
				{ value: 9, text: 'ARM ab 9.0' },
			]"
			:model-value="configuration.firmware"
			@update:model-value="
				updateConfiguration($event, 'configuration.firmware')
			"
		>
			<template #help>
				Die Auswahl der Firmware-Version beeinflusst die Auslesung der
				Wirkleistung und der Phasenströme des Zählers.
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
