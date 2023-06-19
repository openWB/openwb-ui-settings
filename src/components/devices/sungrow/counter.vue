<template>
	<div class="device-sungrow-counter">
		<openwb-base-heading>
			Einstellungen für Sungrow Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Version"
			:options="[
				{ value: 0, text: 'SH (Hybrid)' },
				{ value: 1, text: 'SG (kein Hybrid)' },
				{ value: 2, text: 'SG (kein Hybrid) mit WiNet Dongle' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		>
			<template #help>
				Die Variante SH ist nur über die LAN-IP mit openWB nutzbar.
				Hierzu hinter dem WiNet-S Dongle den Lan Anschluss nutzen. Den
				WiNet-S Dongle zusätzlich ins Heimnetz (per Lan oder Wlan)
				einbinden, um ISolarCloud nutzen zu können.
			</template>
		</openwb-base-select-input>
	</div>
</template>

<script>
export default {
	name: "DeviceSungrowCounter",
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
