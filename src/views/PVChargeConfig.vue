<template>
	<div class="pvChargeConfig">
		<form name="pvChargeConfigForm">
			<openwb-base-card title="Regelparameter">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Regelmodus"
						:buttons="[
							{ buttonValue: 'export', text: 'Einspeisung' },
							{ buttonValue: 'import', text: 'Bezug' },
							{ buttonValue: 'individual', text: 'Individuell' },
						]"
						:model-value="calculateControlMode()"
						@update:model-value="setControlMode($event)"
					>
						<template #help>Hilfetext</template>
					</openwb-base-button-group-input>
					<openwb-base-text-input
						title="Regelbereich"
						subtype="json"
						disabled
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/control_range'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/control_range',
								$event
							)
						"
					>
						<template #help>JSON Objekt zum Debuggen</template>
					</openwb-base-text-input>
					<openwb-base-number-input
						v-if="calculateControlMode() === 'individual'"
						title="Minimum"
						unit="W"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/control_range'
							][0]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/control_range',
								$event,
								0
							)
						"
					>
						<template #help>
							Untere Grenze des Regelbereichs.
						</template>
					</openwb-base-number-input>
					<openwb-base-number-input
						v-if="calculateControlMode() === 'individual'"
						title="Minimum"
						unit="W"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/control_range'
							][1]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/control_range',
								$event,
								1
							)
						"
					>
						<template #help
							>Obere Grenze des Regelbereichs.</template
						>
					</openwb-base-number-input>
					<openwb-base-number-input
						title="Regelpunkt Einspeisegrenze"
						:min="0"
						:step="50"
						unit="W"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/feed_in_yield'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/feed_in_yield',
								$event
							)
						"
					>
						<template #help>
							Parameter für den 70%-Regelpunkt im Modus PV-Laden.
							Dieser Parameter ist nur wirksam bei der Einstellung
							"70%-Regelung eingeschaltet". Der hier eingetragene
							Wert sollte zur optimalen Eigenverbrauchssteuerung
							70% der installierten Generatorleistung betragen.<br />
							Die Nutzung dieser Option ergibt nur Sinn wenn ein
							Wechselrichter und Smart-Meter verbaut ist welches
							eine dynamische Begrenzung der Einspeiseleistung
							bietet.
						</template>
					</openwb-base-number-input>
					<hr />
					<openwb-base-number-input
						title="Einschaltschwelle"
						:min="0"
						:step="50"
						unit="W"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_on_threshold'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_on_threshold',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</openwb-base-number-input>
					<openwb-base-number-input
						title="Einschaltverzögerung"
						:min="0"
						:step="1"
						unit="s"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_on_delay'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_on_delay',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</openwb-base-number-input>
					<hr />
					<openwb-base-number-input
						title="Abschaltschwelle"
						:min="0"
						:step="5"
						unit="W"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_off_threshold'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_off_threshold',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</openwb-base-number-input>
					<openwb-base-number-input
						title="Abschaltverzögerung"
						:min="0"
						:step="1"
						unit="s"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_off_delay'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_off_delay',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</openwb-base-number-input>
				</div>
			</openwb-base-card>
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
							{ buttonValue: 0, text: 'Automatik' },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/phases_to_use'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/phases_to_use',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</openwb-base-button-group-input>
				</div>
			</openwb-base-card>
			<openwb-base-card title="Speicher-Beachtung">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Priorisierung"
						:buttons="[
							{ buttonValue: false, text: 'Fahrzeuge' },
							{ buttonValue: true, text: 'Speicher' },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/bat_prio'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/bat_prio',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</openwb-base-button-group-input>
					<openwb-base-range-input
						title="Einschalt-SoC"
						:min="0"
						:max="19"
						:step="1"
						unit="%"
						:labels="[
							{ label: 'Aus', value: 0 },
							{ label: 5, value: 5 },
							{ label: 10, value: 10 },
							{ label: 15, value: 15 },
							{ label: 20, value: 20 },
							{ label: 25, value: 25 },
							{ label: 30, value: 30 },
							{ label: 35, value: 35 },
							{ label: 40, value: 40 },
							{ label: 45, value: 45 },
							{ label: 50, value: 50 },
							{ label: 55, value: 55 },
							{ label: 60, value: 60 },
							{ label: 65, value: 65 },
							{ label: 70, value: 70 },
							{ label: 75, value: 75 },
							{ label: 80, value: 80 },
							{ label: 85, value: 85 },
							{ label: 90, value: 90 },
							{ label: 95, value: 95 },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_on_soc'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_on_soc',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</openwb-base-range-input>
					<openwb-base-range-input
						title="Ausschalt-SoC"
						:min="0"
						:max="19"
						:step="1"
						unit="%"
						:labels="[
							{ label: 'Aus', value: 0 },
							{ label: 5, value: 5 },
							{ label: 10, value: 10 },
							{ label: 15, value: 15 },
							{ label: 20, value: 20 },
							{ label: 25, value: 25 },
							{ label: 30, value: 30 },
							{ label: 35, value: 35 },
							{ label: 40, value: 40 },
							{ label: 45, value: 45 },
							{ label: 50, value: 50 },
							{ label: 55, value: 55 },
							{ label: 60, value: 60 },
							{ label: 65, value: 65 },
							{ label: 70, value: 70 },
							{ label: 75, value: 75 },
							{ label: 80, value: 80 },
							{ label: 85, value: 85 },
							{ label: 90, value: 90 },
							{ label: 95, value: 95 },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_off_soc'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_off_soc',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</openwb-base-range-input>
					<openwb-base-number-input
						title="Reservierte Ladeleistung"
						:min="0"
						:step="100"
						unit="W"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/charging_power_reserve'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/charging_power_reserve',
								$event
							)
						"
					>
						<template #help>Zahl mit Einheit</template>
					</openwb-base-number-input>
					<openwb-base-number-input
						title="Erlaubte Entladeleistung"
						:min="0"
						:step="100"
						unit="W"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/rundown_power'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/rundown_power',
								$event
							)
						"
					>
						<template #help>Zahl mit Einheit</template>
					</openwb-base-number-input>
					<openwb-base-range-input
						title="Minimaler Entlade-SoC"
						:min="0"
						:max="20"
						:step="1"
						unit="%"
						:labels="[
							{ label: 0, value: 0 },
							{ label: 5, value: 5 },
							{ label: 10, value: 10 },
							{ label: 15, value: 15 },
							{ label: 20, value: 20 },
							{ label: 25, value: 25 },
							{ label: 30, value: 30 },
							{ label: 35, value: 35 },
							{ label: 40, value: 40 },
							{ label: 45, value: 45 },
							{ label: 50, value: 50 },
							{ label: 55, value: 55 },
							{ label: 60, value: 60 },
							{ label: 65, value: 65 },
							{ label: 70, value: 70 },
							{ label: 75, value: 75 },
							{ label: 80, value: 80 },
							{ label: 85, value: 85 },
							{ label: 90, value: 90 },
							{ label: 95, value: 95 },
							{ label: 'Aus', value: 100 },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/rundown_soc'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/rundown_soc',
								$event
							)
						"
					>
						<template #help>Hilfetext</template>
					</openwb-base-range-input>
				</div>
			</openwb-base-card>
			<openwb-base-submit-buttons
				formName="pvChargeConfigForm"
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
	name: "PVChargeConfig",
	mixins: [ComponentStateMixin],
	methods: {
		calculateControlMode() {
			const topic =
				"openWB/general/chargemode_config/pv_charging/control_range";
			let state = this.$store.state.mqtt[topic];
			// console.log(typeof state);
			if (typeof state != "undefined") {
				if (state[0] === -230 && state[1] === 0) {
					return "export";
				}
				if (state[0] === 0 && state[1] === 230) {
					return "import";
				}
				return "individual";
			}
		},
		setControlMode(newMode) {
			const topic =
				"openWB/general/chargemode_config/pv_charging/control_range";
			console.log("set controlMode", newMode);
			switch (newMode) {
				case "export":
					this.updateState(topic, [-230, 0]);
					break;
				case "import":
					this.updateState(topic, [0, 230]);
					break;
				case "individual":
					this.updateState(topic, [-230, 230]);
					break;
			}
		},
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/general/chargemode_config/pv_charging/control_range",
				"openWB/general/chargemode_config/pv_charging/feed_in_yield",
				"openWB/general/chargemode_config/pv_charging/switch_on_threshold",
				"openWB/general/chargemode_config/pv_charging/switch_on_delay",
				"openWB/general/chargemode_config/pv_charging/switch_off_threshold",
				"openWB/general/chargemode_config/pv_charging/switch_off_delay",
				"openWB/general/chargemode_config/pv_charging/phases_to_use",
				"openWB/general/chargemode_config/pv_charging/bat_prio",
				"openWB/general/chargemode_config/pv_charging/switch_on_soc",
				"openWB/general/chargemode_config/pv_charging/switch_off_soc",
				"openWB/general/chargemode_config/pv_charging/charging_power_reserve",
				"openWB/general/chargemode_config/pv_charging/rundown_power",
				"openWB/general/chargemode_config/pv_charging/rundown_soc",
			],
		};
	},
};
</script>
