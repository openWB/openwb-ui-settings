<template>
	<div class="chargepoint-installation">
		<openwb-base-card
			title="Ladepunkte"
			:collapsible="true"
			:collapsed="true"
		>
			<openwb-base-select-input
				title="Verfügbare Ladepunkte"
				notSelected="Bitte auswählen"
				:options="getChargepointList()"
				:model-value="chargepointToAdd"
				@update:model-value="chargepointToAdd = $event"
			>
				<template #append>
					<span class="col-1">
						<openwb-base-click-button
							:class="
								chargepointToAdd === undefined
									? 'btn-outline-success'
									: 'btn-success'
							"
							:disabled="chargepointToAdd === undefined"
							@click="addChargepoint"
						>
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'plus']"
							/>
						</openwb-base-click-button>
					</span>
				</template>
				<template #help>
					Bitte einen Ladepunkt auswählen, der hinzugefügt werden
					soll.
				</template>
			</openwb-base-select-input>
		</openwb-base-card>

		<openwb-base-submit-buttons
			@save="$emit('save')"
			@reset="$emit('reset')"
			@defaults="$emit('defaults')"
		/>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus as fasPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus);

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "ChargepointInstallation",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [],
			chargepointToAdd: undefined,
		};
	},
	methods: {
		addChargepoint() {
			this.$emit("sendCommand", {
				command: "addChargepoint",
				data: {
					type: this.chargepointToAdd,
				},
			});
		},
		getChargepointList() {
			return this.$store.state.examples.availableChargepoints;
		},
	},
};
</script>

<style></style>
