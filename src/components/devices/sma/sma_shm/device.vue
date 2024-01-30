<template>
	<div class="device-smahm">
		<openwb-base-heading>
			Einstellungen für SMA Home Manager / Energy Meter
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Dieses Gerät benötigt keine Einstellungen.
		</openwb-base-alert>
	</div>
</template>

<script>
import DeviceConfigMixin from "../deviceConfigMixin.vue";

export default {
	name: "DeviceSmaHm",
	mixins: [DeviceConfigMixin],
};
</script>
