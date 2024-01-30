<template>
	<div class="charge-point-openwbpro">
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="chargePoint.configuration.ip_address"
			@update:model-value="updateConfiguration($event, 'ip_address')"
		/>
	</div>
</template>

<script>
export default {
	name: "ChargePointOpenwbPro",
	emits: ["update:configuration"],
	props: {
		chargePoint: { type: Object, required: true },
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
