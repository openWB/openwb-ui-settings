<template>
	<div class="device-kostalplenticore">
		<openwb-base-heading>
			Einstellungen für Kostal Plenticore
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Wenn am Kostal Plenticore-Wechselrichter ein EM300 oder Kostal
			Energy Smart Meter (KSEM) angeschlossen ist, muss eine Zähler-und
			eine Wechselrichter-Komponente angelegt werden.
		</openwb-base-alert>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="device.configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		/>
		<openwb-base-number-input
			title="Port"
			required
			:min="1"
			:max="65535"
			:model-value="configuration.port"
			@update:model-value="
				updateConfiguration($event, 'configuration.port')
			"
		/>
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
import DeviceConfigMixin from "../deviceConfigMixin.vue";

export default {
	name: "DeviceKostalPlenticore",
	mixins: [DeviceConfigMixin],
};
</script>
