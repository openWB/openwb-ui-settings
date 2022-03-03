<template>
	<div class="instantChargeConfig">
		<form name="instantChargeConfigForm">
			<openwb-base-card title="Phasenumschaltung">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Anzahl Phasen"
						:buttons="[
							{ buttonValue: 1, text: '1' },
							{ buttonValue: 3, text: 'Maximum' },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/instant_charging/phases_to_use'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/instant_charging/phases_to_use',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</openwb-base-button-group-input>
				</div>
			</openwb-base-card>
			<openwb-base-submit-buttons
				formName="instantChargeConfigForm"
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
		</form>
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "OpenwbInstantChargeConfig",
	mixins: [ComponentStateMixin],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/general/chargemode_config/instant_charging/phases_to_use",
			],
		};
	},
};
</script>
