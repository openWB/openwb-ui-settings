<template>
	<div class="loadManagementConfig">
		<form name="loadManagementConfigForm">
			<openwb-base-card
				title="Einstellungen"
				:collapsible="true"
				:collapsed="false"
			>
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Nicht-ladende Fahrzeuge"
						:buttons="[
							{
								buttonValue: false,
								text: 'nicht berücksichtigen',
								class: 'btn-outline-danger',
							},
							{
								buttonValue: true,
								text: 'berücksichtigen',
								class: 'btn-outline-success',
							},
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/counter/config/reserve_for_not_charging'
							]
						"
						@update:model-value="
							updateState(
								'openWB/counter/config/reserve_for_not_charging',
								$event,
							)
						"
					>
						<template #help>
							<p>
								Wenn angesteckte Fahrzeuge, die nicht laden, im
								Lastmanagement berücksichtigt werden, wird für
								diese der Fahrzeug-Mindeststrom bei vorliegender
								Ladefreigabe reserviert. Dadurch können bei
								Eingreifen des Lastmanagements andere Fahrzeuge
								möglicherweise nur mit reduzierter Stromstärke
								laden und der reservierte Strom wird nicht
								genutzt. Wenn die Fahrzeuge wieder Leistung
								beziehen, z.B. um vorzuklimatisieren, nutzen sie
								den für sie reservierten Strom.
							</p>
							<p>
								Wenn angesteckte Fahrzeuge, die nicht laden,
								nicht im Lastmanagement berücksichtigt werden,
								wird für diese auch kein Strom bei vorliegender
								Ladefreigabe reserviert. Andere Fahrzeuge können
								dadurch mit höherer Stromstärke laden. Wenn die
								maximalen Lastmanagement-Grenzen fast erreicht
								sind und die Fahrzeuge wieder Leistung beziehen,
								z.B. um vorzuklimatisieren, kann es zu einer
								kurzzeitigen Überschreitung der
								Lastmanagement-Grenzen kommen, bis im nächsten
								Zyklus die Stromstärken aller Ladepunkte an die
								neue Situation angepasst wurden. Das kurzzeitige
								Überschreiten der Maximal-Werte stellt für die
								Sicherungen in der Regel kein Problem dar.
							</p>
						</template>
					</openwb-base-button-group-input>
					<openwb-base-heading>
						Vorhandene Zählermodule
					</openwb-base-heading>
					<openwb-base-alert subtype="info">
						Die maximale Leistung wird nur für den EVU-Zähler
						berücksichtigt. Bei Zwischenzählern begrenzt das
						Lastmanagement rein anhand der maximalen Phasenströme.
					</openwb-base-alert>
					<openwb-base-card
						v-for="counter in counterConfigs"
						:key="counter.id"
						:collapsible="true"
						:collapsed="true"
						subtype="danger"
					>
						<template #header>
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'gauge-high']"
							/>
							{{ counter.name }}
						</template>
						<openwb-base-number-input
							title="Maximale Leistung"
							:min="1"
							:step="1"
							unit="kW"
							:model-value="
								$store.state.mqtt[
									'openWB/counter/' +
										counter.id +
										'/config/max_total_power'
								] / 1000
							"
							@update:model-value="
								updateState(
									'openWB/counter/' +
										counter.id +
										'/config/max_total_power',
									$event * 1000,
								)
							"
						>
							<template #help>
								Maximal zulässige Leistung für diesen
								(Zwischen-)Zähler.
							</template>
						</openwb-base-number-input>
						<openwb-base-number-input
							title="Maximaler Strom L1"
							:min="16"
							:step="1"
							unit="A"
							:model-value="
								$store.state.mqtt[
									'openWB/counter/' +
										counter.id +
										'/config/max_currents'
								][0]
							"
							@update:model-value="
								updateState(
									'openWB/counter/' +
										counter.id +
										'/config/max_currents',
									$event,
									'0',
								)
							"
						>
							<template #help>
								Maximal zulässiger Strom für die Phase 1 dieses
								(Zwischen-)Zählers.
							</template>
						</openwb-base-number-input>
						<openwb-base-number-input
							title="Maximaler Strom L2"
							:min="16"
							:step="1"
							unit="A"
							:model-value="
								$store.state.mqtt[
									'openWB/counter/' +
										counter.id +
										'/config/max_currents'
								][1]
							"
							@update:model-value="
								updateState(
									'openWB/counter/' +
										counter.id +
										'/config/max_currents',
									$event,
									'1',
								)
							"
						>
							<template #help>
								Maximal zulässiger Strom für die Phase 2 dieses
								(Zwischen-)Zählers.
							</template>
						</openwb-base-number-input>
						<openwb-base-number-input
							title="Maximaler Strom L3"
							:min="16"
							:step="1"
							unit="A"
							:model-value="
								$store.state.mqtt[
									'openWB/counter/' +
										counter.id +
										'/config/max_currents'
								][2]
							"
							@update:model-value="
								updateState(
									'openWB/counter/' +
										counter.id +
										'/config/max_currents',
									$event,
									'2',
								)
							"
						>
							<template #help>
								Maximal zulässiger Strom für die Phase 3 dieses
								(Zwischen-)Zählers.
							</template>
						</openwb-base-number-input>
					</openwb-base-card>
					<openwb-base-heading>
						Vorhandene Wechselrichtermodule
					</openwb-base-heading>
					<openwb-base-card
						v-for="inverter in inverterConfigs"
						:key="inverter.id"
						:collapsible="true"
						:collapsed="true"
						subtype="success"
					>
						<template #header>
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'solar-panel']"
							/>
							{{ inverter.name }}
						</template>
						<openwb-base-number-input
							title="Maximale Ausgangsleistung des Wechselrichters"
							:min="0"
							:step="0.1"
							unit="kW"
							:model-value="
								$store.state.mqtt[
									'openWB/pv/' +
										inverter.id +
										'/config/max_ac_out'
								] / 1000
							"
							@update:model-value="
								updateState(
									'openWB/pv/' +
										inverter.id +
										'/config/max_ac_out',
									$event * 1000,
								)
							"
						>
							<template #help>
								Relevant bei Hybrid-Systemen mit DC-Speicher.
							</template>
						</openwb-base-number-input>
					</openwb-base-card>
				</div>
			</openwb-base-card>
			<openwb-base-card
				title="Struktur"
				:collapsible="true"
				:collapsed="true"
			>
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<!-- ToDo: Fix: nested lists bypass store commits! -->
					<sortable-list
						title="Anordnung der Komponenten"
						:model-value="
							$store.state.mqtt['openWB/counter/get/hierarchy']
						"
						@update:model-value="
							updateState('openWB/counter/get/hierarchy', $event)
						"
						:labels="hierarchyLabels"
					>
						<template #help>
							Durch die Anordnung der Komponenten werden
							Abhängigkeiten abgebildet.<br />
							An erster Stelle muss eine Zählerkomponente stehen,
							die den Netzanschlusspunkt erfasst. Dafür kann auch
							ein virtueller Zähler genutzt werden.<br />
							Die weiteren Komponenten müssen hierarchisch so
							angeordnet werden, wie sie auch physisch im
							Stromnetz angeschlossen werden.<br />
							Bei DC-gekoppelten Speichern sind diese hinter dem
							zugehörigen Wechselrichter zu platzieren, damit die
							Abhängigkeit in der Regelung berücksichtigt werden
							kann.
						</template>
					</sortable-list>
				</div>
			</openwb-base-card>

			<openwb-base-submit-buttons
				formName="loadManagementConfigForm"
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
		</form>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faSolarPanel as fasSolarPanel,
	faGaugeHigh as fasGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasSolarPanel, fasGaugeHigh);

import ComponentState from "../components/mixins/ComponentState.vue";
import SortableList from "../components/OpenwbSortableList.vue";

export default {
	name: "OpenwbLoadManagementConfig",
	mixins: [ComponentState],
	emits: ["sendCommand"],
	components: {
		SortableList,
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/counter/config/reserve_for_not_charging",
				"openWB/counter/get/hierarchy",
				"openWB/system/device/+/component/+/config",
				"openWB/counter/+/config/max_currents",
				"openWB/counter/+/config/max_total_power",
				"openWB/pv/+/config/max_ac_out",
				"openWB/chargepoint/+/config",
			],
		};
	},
	computed: {
		counterConfigs: {
			get() {
				let installedComponentsConfigs = this.getWildcardTopics(
					"openWB/system/device/+/component/+/config",
				);
				return Object.keys(installedComponentsConfigs)
					.filter((key) => {
						return installedComponentsConfigs[key].type.includes(
							"counter",
						);
					})
					.reduce((obj, key) => {
						return {
							...obj,
							[key]: installedComponentsConfigs[key],
						};
					}, {});
			},
		},
		inverterConfigs: {
			get() {
				let installedComponentsConfigs = this.getWildcardTopics(
					"openWB/system/device/+/component/+/config",
				);
				return Object.keys(installedComponentsConfigs)
					.filter((key) => {
						return installedComponentsConfigs[key].type.includes(
							"inverter",
						);
					})
					.reduce((obj, key) => {
						return {
							...obj,
							[key]: installedComponentsConfigs[key],
						};
					}, {});
			},
		},
		hierarchyLabels: {
			get() {
				let labels = {};
				for (const element of Object.values(
					this.$store.state.mqtt["openWB/counter/get/hierarchy"],
				)) {
					labels = {
						...labels,
						...this.getElementTreeNames(element),
					};
				}
				return labels;
			},
		},
	},
	methods: {
		getElementTreeNames(element) {
			let myNames = {};
			if (element.type == "cp") {
				let chargePoint = this.getChargePoint(element.id);
				if (chargePoint) {
					myNames[element.id] = chargePoint.name;
				}
			} else {
				let component = this.getComponent(element.id);
				if (component) {
					myNames[element.id] = component.name;
				}
			}
			element.children.forEach((child) => {
				myNames = { ...myNames, ...this.getElementTreeNames(child) };
			});
			return myNames;
		},
		getComponent(componentIndex) {
			let myComponent = undefined;
			Object.keys(this.$store.state.mqtt).forEach((value) => {
				if (
					value.match(
						"^openWB/system/device/[0-9]+/component/" +
							componentIndex +
							"/config$",
					)
				) {
					myComponent = this.$store.state.mqtt[value];
				}
			});
			return myComponent;
		},
		getChargePoint(chargePointIndex) {
			let myChargePoint = undefined;
			Object.keys(this.$store.state.mqtt).forEach((value) => {
				if (
					value.match(
						"^openWB/chargepoint/" + chargePointIndex + "/config$",
					)
				) {
					myChargePoint = this.$store.state.mqtt[value];
				}
			});
			return myChargePoint;
		},
	},
};
</script>
