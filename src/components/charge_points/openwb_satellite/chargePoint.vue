<template>
	<div class="charge-point-satellite">
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="updateConfiguration($event, 'ip_address')"
		/>
		<openwb-base-select-input
			title="Zählertyp"
			:options="[
				{ value: 'sdm630', text: 'SDM630' },
			]"
			:model-value="configuration.counter_type"
			@update:model-value="
				updateConfiguration($event, 'configuration.counter_type')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "ChargePointSatellite",
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
