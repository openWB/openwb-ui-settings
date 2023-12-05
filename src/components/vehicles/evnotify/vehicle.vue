<template>
	<div class="vehicle-soc-evnotify">
		<openwb-base-number-input
			title="ID"
			required
			:min="0"
			:model-value="vehicle.configuration.id"
			@update:model-value="
				updateConfiguration($event, 'configuration.id')
			"
		/>
		<openwb-base-text-input
			title="AKey"
			required
			:model-value="vehicle.configuration.akey"
			@update:model-value="
				updateConfiguration($event, 'configuration.akey')
			"
		/>
		<openwb-base-text-input
			title="Token"
			required
			:model-value="vehicle.configuration.token"
			@update:model-value="
				updateConfiguration($event, 'configuration.token')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "VehicleSocEvnotify",
	emits: ["update:configuration"],
	props: {
		vehicleId: { required: true, type: Number },
		vehicle: { required: true, type: Object },
	},
	data() {
		return {};
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
