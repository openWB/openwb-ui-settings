<template>
	<div class="device-kostalpiko-inverter">
		<openwb-base-heading>
			Einstellungen für Kostal Piko Wechselrichter
		</openwb-base-heading>
		<openwb-base-button-group-input
			title="Speicher"
			:buttons="[
				{ buttonValue: false, text: 'nicht vorhanden' },
				{ buttonValue: true, text: 'vorhanden' },
			]"
			:model-value="configuration.bat_configured"
			@update:model-value="
				updateConfiguration($event, 'configuration.bat_configured')
			"
		/>
	</div>
</template>

<script>
import ComponentConfigMixin from "../componentConfigMixin.vue";

export default {
	name: "DeviceKostalPikoInverter",
	mixins: [ComponentConfigMixin],
};
</script>
