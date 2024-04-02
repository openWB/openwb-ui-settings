<template>
	<div class="charge-point-openwbdcadapter">
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
	name: "ChargePointOpenwbDcAdapter",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		chargePointId: { default: undefined },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			if (path) {
				path = "configuration." + path;
			}
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
