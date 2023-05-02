<template>
	<div class="charge-point-internalopenwb">
		<openwb-base-select-input
			title="Bauart"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 'series', text: 'openWB Series 1/2 in den Varianten Custom, Standard & Standard+' },
				{ value: 'duo', text: 'openWB Series 1/2 Duo' },
				{ value: 'socket', text: 'openWB Series 1/2 Buchse' },
			]"
			:model-value="configuration.mode"
			@update:model-value="
				updateConfiguration($event, 'mode')
			"
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
	name: "ChargePointInternalOpenwb",
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
