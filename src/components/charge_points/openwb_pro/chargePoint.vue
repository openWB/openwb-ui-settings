<template>
	<div class="charge-point-openwbpro">
		<openwb-base-heading>
			Einstellungen für Ladepunkt OpenWB Pro
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="updateConfiguration($event, 'ip_address')"
		/>
	</div>
</template>

<script>
export default {
	name: "ChargePointOpenwbPro",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		chargePointId: { default: undefined },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			if (path) {
				path = "connection_module.configuration." + path;
			}
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
