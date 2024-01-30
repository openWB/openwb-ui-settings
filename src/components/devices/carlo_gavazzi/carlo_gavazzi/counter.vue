<template>
	<div class="device-carlogavazzi-counter">
		<openwb-base-alert subtype="info">
			ModbusTCP muss aktiviert sein. Ausgelesen wird ID 1 auf Port 502.
		</openwb-base-alert>
	</div>
</template>

<script>
import ComponentConfigMixin from "../componentConfigMixin.vue";

export default {
	name: "DeviceCarloGavazziCounter",
	mixins: [ComponentConfigMixin],
};
</script>
