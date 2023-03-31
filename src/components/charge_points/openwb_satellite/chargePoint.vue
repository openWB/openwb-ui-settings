<template>
	<div class="charge-point-satellite">
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="updateConfiguration($event, 'ip_address')"
		/>
		<openwb-base-number-input
			title="Modbus-ID der EVSE"
			required
			:min="1"
			:max="255"
			:model-value="configuration.modbus_id_evse"
			@update:model-value="updateConfiguration($event, 'modbus_id_evse')"
		/>
		<openwb-base-select-input
			title="Zählertyp"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 'mpm3pm', text: 'MPMP3PM' },
				{ value: 'sdm630', text: 'SDM630' },
			]"
			:model-value="configuration.counter_type"
			@update:model-value="
				updateConfiguration($event, 'configuration.counter_type')
			"
		/>
		<openwb-base-number-input
			title="Modbus-ID des Zählers"
			required
			:min="1"
			:max="255"
			:model-value="configuration.modbus_id_counter"
			@update:model-value="
				updateConfiguration($event, 'modbus_id_counter')
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
