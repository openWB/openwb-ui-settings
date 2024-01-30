<template>
	<div class="device-openwb-pvkit">
		<openwb-base-heading>
			Einstellungen für openWB PV-Kit
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Dieses Gerät erfordert keine Einstellungen.
		</openwb-base-alert>
	</div>
</template>

<script>
import DeviceConfigMixin from "../deviceConfigMixin.vue";

export default {
	name: "DeviceOpenwbPvKit",
	mixins: [DeviceConfigMixin],
};
</script>
