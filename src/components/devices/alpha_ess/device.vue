<template>
	<div class="device-alphaess">
		<openwb-base-heading>
			Einstellungen für Alpha ESS
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Ausleseart"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'Alpha ESS-Kit' },
				{ value: 1, text: 'Hi 5/10' },
			]"
			:model-value="configuration.source"
			@update:model-value="
				updateConfiguration($event, 'configuration.source')
			"
		/>
		<openwb-base-text-input
			title="IP oder Hostname"
			v-if="configuration.source == 1"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		/>
		<openwb-base-select-input
			title="Firmware Version"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'EMS älter als 1.23V' },
				{ value: 1, text: 'EMS 1.23V oder neuer' },
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
	name: "DeviceAlphaess",
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
