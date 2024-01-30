<template>
	<div class="device-studer-bat">
		<openwb-base-heading>
			Einstellungen für Studer Batteriespeicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Modbus ID"
			required
			:model-value="component.configuration.modbus_id"
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
	name: "DeviceStuderBat",
	mixins: [ComponentConfigMixin],
};
</script>
