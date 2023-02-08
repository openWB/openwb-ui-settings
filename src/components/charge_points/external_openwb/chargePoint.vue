<template>
	<div class="charge-point-externalopenwb">
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="updateConfiguration($event, 'ip_address')"
		/>
		<openwb-base-number-input
			title="Ladepunkt-Nummer"
			required
			:min="1"
			:max="2"
			:model-value="configuration.duo_num"
			@update:model-value="updateConfiguration($event, 'duo_num')"
		>
			<template #help>
				Bei einfachen Ladepunkten ist hier immer eine "1" einzutragen.
				Lediglich bei einer openWB Duo kann mit "2" der zweite
				enthaltene Ladepunkt angesprochen werden.
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "ChargePointExternalOpenwb",
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
