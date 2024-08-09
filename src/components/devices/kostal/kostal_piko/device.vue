<template>
	<div class="device-kostalpiko">
		<openwb-base-heading>
			Einstellungen für Kostal Piko
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Der Wechselrichter liefert Werte nur, solange er auch PV-Leistung
			liefert. Nachts geht er in den Standby. Die Hausanschlussüberwachung
			ist nur aktiv, wenn der Wechselrichter auch aktiv ist.
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
	name: "DeviceKostalPiko",
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
