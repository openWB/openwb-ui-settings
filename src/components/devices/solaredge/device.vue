<template>
	<div class="device-solaredge">
		<openwb-base-heading>
			Einstellungen für SolarEdge
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			ModbusTCP muss im Wechselrichter aktiviert werden und der
			Wechselrichter per LAN angebunden sein.
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
		>
			<template #help>
				Je nach Produktionsdatum und Softwareversion ist 502 oder 1502
				ab Werk eingestellt. Bitte im Wechselrichter überprüfen.
			</template>
		</openwb-base-number-input>
		<openwb-base-button-group-input
			title="Speicherleistung von PV subtrahieren"
			:buttons="[
				{ buttonValue: false, text: 'Lade- und Entladeleistung' },
				{ buttonValue: true, text: 'nur Entladeleistung' },
			]"
			:model-value="configuration.fix_only_bat_discharging"
			@update:model-value="
				updateConfiguration(
					$event,
					'configuration.fix_only_bat_discharging'
				)
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceSolarEdge",
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
