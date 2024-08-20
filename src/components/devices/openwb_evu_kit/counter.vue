<template>
	<div class="device-openwb-evukit-counter">
		<openwb-base-heading>
			Einstellungen für openWB EVU-Kit Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Zählermodell"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 3, text: 'B23' },
				{ value: 1, text: 'Lovato' },
				{ value: 0, text: 'MPM3PM' },
				{ value: 2, text: 'SDM630/SDM72D-M' },
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
	name: "DeviceOpenwbEvukitCounter",
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
