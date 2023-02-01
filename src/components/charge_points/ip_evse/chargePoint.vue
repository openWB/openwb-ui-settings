<template>
	<div class="charge-point-ipevse">
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="updateConfiguration($event, 'ip_address')"
		/>
		<openwb-base-number-input
			title="Modbus-ID"
			required
			:min="1"
			:max="255"
			:model-value="configuration.modbus_id"
			@update:model-value="updateConfiguration($event, 'modbus_id')"
		/>
	</div>
</template>

<script>
export default {
	name: "ChargePointIpEvse",
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
