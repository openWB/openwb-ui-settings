<template>
	<div class="device-sungrow">
		<openwb-base-heading>
			Einstellungen für Sungrow
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Einige Sungrow-Geräte, wie z.B. der SH10RT, verfügen über zwei
			LAN-Schnittstellen. Eine davon nutzt den WiNet-S Dongle, die andere
			nicht. Wenn keine oder fehlerhafte Daten ausgelesen werden, den
			LAN-Anschluss ohne WiNet-S Dongle nutzen.
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
