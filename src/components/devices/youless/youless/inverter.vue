<template>
	<div class="device-youless-inverter">
		<openwb-base-heading>
			Einstellungen für Youless LS120 Wechselrichter
		</openwb-base-heading>
		<openwb-base-button-group-input
			title="S0-Eingang auslesen"
			:buttons="[
				{ buttonValue: false, text: 'nein' },
				{ buttonValue: true, text: 'ja' },
			]"
			:model-value="component.configuration.source_s0"
			@update:model-value="
				updateConfiguration($event, 'configuration.source_s0')
			"
		>
		</openwb-base-button-group-input>
	</div>
</template>

<script>
import ComponentConfigMixin from "../componentConfigMixin.vue";

export default {
	name: "DeviceYoulessInverter",
	mixins: [ComponentConfigMixin],
};
</script>
