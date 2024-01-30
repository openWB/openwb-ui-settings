<template>
	<div class="device-openwb-batkit">
		<openwb-base-heading>
			Einstellungen für openWB Speicher-Kit
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Dieses Gerät erfordert keine Einstellungen.
		</openwb-base-alert>
	</div>
</template>

<script>
import DeviceConfigMixin from "../deviceConfigMixin.vue";

export default {
	name: "DeviceOpenwbBatKit",
	mixins: [DeviceConfigMixin],
};
</script>
