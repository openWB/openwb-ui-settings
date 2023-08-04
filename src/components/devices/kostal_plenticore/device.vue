<template>
	<div class="device-kostalplenticore">
		<openwb-base-heading>
			Einstellungen für Kostal Plenticore
			<span class="small">(Modul: {{ $options.name }})</span>
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
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceKostalPlenticore",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
