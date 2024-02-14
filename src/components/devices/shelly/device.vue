<template>
	<div class="device-shelly">
		<openwb-base-heading>
			Einstellungen für Shelly
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		/>
		<openwb-base-select-input
			title="Modell"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 1, text: 'Shelly 1pm' },
				{ value: 2, text: 'Shelly 1pm plus' },
				{ value: 3, text: 'Shelly Pro3EM' },
			]"
			:model-value="configuration.type"
			@update:model-value="
				updateConfiguration($event, 'configuration.generation')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceShelly",
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
