<template>
	<div class="device-e3dc-inverter">
		<openwb-base-heading>
			Einstellungen für E3DC Wechselrichter
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-button-group-input
			title="Externe Produktion"
			:buttons="[
				{
					buttonValue: false,
					text: 'Nein',
					class: 'btn-outline-danger',
				},
				{
					buttonValue: true,
					text: 'Ja',
					class: 'btn-outline-success',
				},
			]"
			:model-value="configuration.read_ext"
			@update:model-value="
				updateConfiguration($event, 'configuration.read_ext')
			"
		>
			<template #help>
				Hiermit kann festgelegt werden, dass ein als "Externe
				Produktion" in E3DC eingebundener Wechselrichter berücksichtigt
				werden soll.
			</template>
		</openwb-base-button-group-input>
	</div>
</template>

<script>
export default {
	name: "DeviceE3dcInverter",
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
