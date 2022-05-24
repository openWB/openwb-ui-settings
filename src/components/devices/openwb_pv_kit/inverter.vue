<template>
	<div class="device-openwb-pvkit-inverter">
		<openwb-base-heading>
			Einstellungen für openWB PV-Kit Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Zählermodell"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'MPM3PM' },
				{ value: 1, text: 'Lovato' },
				{ value: 2, text: 'SDM630' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceOpenwbPvkitInverter",
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
