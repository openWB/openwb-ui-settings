<template>
	<div class="device-openwb-evukit">
		<openwb-base-heading>
			Einstellungen für openWB EVU-Kit
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Dieses Gerät erfordert keine Einstellungen.
		</openwb-base-alert>
	</div>
</template>

<script>
import DeviceConfigMixin from "../deviceConfigMixin.vue";

export default {
	name: "DeviceOpenwbEvuKit",
	mixins: [DeviceConfigMixin],
};
</script>
