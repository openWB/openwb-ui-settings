<template>
	<div class="vehicle-soc-evnotify">
		<openwb-base-heading>
			Einstellungen für EVnotify SoC
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="ID"
			required
			:min="0"
			:model-value="configuration.id"
			@update:model-value="
				updateConfiguration($event, 'configuration.id')
			"
		/>
		<openwb-base-text-input
			title="AKey"
			required
			:model-value="configuration.akey"
			@update:model-value="
				updateConfiguration($event, 'configuration.akey')
			"
		/>
		<openwb-base-text-input
			title="Token"
			required
			:model-value="configuration.token"
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
		configuration: { type: Object, required: true },
		vehicleId: { required: true },
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
