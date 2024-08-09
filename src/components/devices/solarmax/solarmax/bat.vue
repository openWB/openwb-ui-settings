<template>
	<div class="device-solarmax-bat">
		<openwb-base-heading>
			Einstellungen für Solarmax MAX.STORAGE / MAX.STORAGE Ultimate
			Batteriespeicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Solarmax MAX.STORAGE / MAX.STORAGE Ultimate Batteriespeicher sind
			Teil eines Hybridsystems. Daher muss auch eine Komponente
			Wechselrichter angelegt werden.
		</openwb-base-alert>
		<openwb-base-number-input
			title="Modbus ID"
			required
			:model-value="configuration.modbus_id"
			min="1"
			max="255"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceSolarmaxBat",
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
