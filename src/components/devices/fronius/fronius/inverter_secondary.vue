<template>
	<div class="device-fronius-inverter-secondary">
		<openwb-base-heading>
			Einstellungen für einen sekundären Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="ID"
			:model-value="configuration.id"
			min="0"
			@update:model-value="
				updateConfiguration($event, 'configuration.id')
			"
		>
			<template #help>
				Die ID des sekundären Wechselrichters. Diese ist für jede
				Installation individuell und muss ermittelt werden. Dafür kann
				der folgende Link verwendet werden. Die ID kann den
				zurückgegebenen JSON entnommen werden.
				<a
					:href="powerFlowUrl"
					target="_blank"
					rel="noopener noreferrer"
				>
					{{ powerFlowUrl }} </a
				><br />
				Im Abschnitt "Body" -> "Data" -> "SecondaryMeters" werden die
				installierten Zähler angezeigt. Die ID ist die Zahl vor dem
				Doppelpunkt und den zugehörigen Daten.
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceFroniusSecondaryInverter",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
		componentId: { required: true },
	},
	computed: {
		powerFlowUrl: {
			get() {
				return `http://${this.deviceIpAddress}/solar_api/v1/GetPowerFlowRealtimeData.fcgi?Scope=System`;
			},
		},
		deviceIpAddress: {
			get() {
				return this.$store.state.mqtt[
					`openWB/system/device/${this.deviceId}/config`
				]?.configuration.ip_address;
			},
		},
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
