<template>
	<div class="charge-point-smartwb">
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="updateConfiguration($event, 'ip_address')"
		/>
		<openwb-base-number-input
			title="Wartezeit"
			required
			:min="2"
			:max="10"
			unit="s"
			:model-value="configuration.timeout"
			@update:model-value="updateConfiguration($event, 'timeout')"
		>
			<template #help>
				Zeitangabe in Sekunden, für die auf eine Antwort des Ladepunktes
				gewartet wird. Wird diese Zeit überschritten, so wird von einer
				Kommunikationsstörung ausgegangen.
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "ChargePointSmartwb",
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
