<template>
	<div class="device-openwb-flex-counter">
		<openwb-base-heading>
			Einstellungen für openWB-Flex Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Bei saldierenden Zählern (MPM3PM) werden die Zählerstände für
			Einspeisung und Bezug aus dem Zähler ausgelesen. Bei Zählern, die
			nicht saldierend arbeiten (Lovato, SDM630, SDM72D-M, B23), werden die
			Zählerstände von der openWB berechnet.
		</openwb-base-alert>
		<openwb-base-select-input
			title="Zählermodell"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'MPM3PM' },
				{ value: 1, text: 'Lovato' },
				{ value: 2, text: 'SDM630/SDM72D-M' },
				{ value: 3, text: 'B23' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		/>
		<openwb-base-number-input
			title="Modbus-ID"
			required
			:min="1"
			:max="255"
			:model-value="configuration.id"
			@update:model-value="
				updateConfiguration($event, 'configuration.id')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceOpenwbFlexCounter",
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
