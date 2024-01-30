<template>
	<div class="device-virtual">
		<openwb-base-heading>
			Einstellungen für virtuelle Geräte
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Dieses Gerät erfordert keine Einstellungen.
		</openwb-base-alert>
	</div>
</template>

<script>
import DeviceConfigMixin from "../deviceConfigMixin.vue";

export default {
	name: "DeviceVirtual",
	mixins: [DeviceConfigMixin],
};
</script>
