<template>
	<div class="charge-point-internalopenwb">
		<openwb-base-select-input
			title="Bauart"
			notSelected="Bitte auswählen"
			:options="[
				{
					value: 'series',
					text: 'openWB series1/2 in den Varianten custom, standard & standard+',
				},
				{ value: 'duo', text: 'openWB series1/2 Duo' },
				{ value: 'socket', text: 'openWB series1/2 Buchse' },
			]"
			:model-value="configuration.mode"
			@update:model-value="updateConfiguration($event, 'mode')"
		/>
		<openwb-base-number-input
			v-if="configuration.mode == 'duo'"
			title="Ladepunkt-Nummer"
			required
			:min="1"
			:max="2"
			:model-value="configuration.duo_num + 1"
			@update:model-value="updateConfiguration($event - 1, 'duo_num')"
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
				if (path === "mode") {
					// set "duo_num" to "1" for mode which only support one charge point
					if (event == "series" || event == "socket") {
						this.updateConfiguration(0, "duo_num");
					}
				}
				path = "configuration." + path;
			}
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
