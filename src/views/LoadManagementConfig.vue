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
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-heading>
						Vorhandene Zählermodule
					</openwb-base-heading>
					<openwb-base-card
						v-for="counter in counterConfigs"
						:key="counter.id"
						:title="counter.name"
						:collapsible="true"
						:collapsed="true"
						subtype="danger"
					>
						<openwb-base-number-input
							title="Maximale Leistung"
							:min="1000"
							:step="1000"
							unit="W"
							:model-value="
								$store.state.mqtt[
									'openWB/counter/' +
										counter.id +
										'/config/max_total_power'
								]
							"
							@update:model-value="
								updateState(
									'openWB/counter/' +
										counter.id +
										'/config/max_total_power',
									$event
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
									'0'
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
									'1'
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
									'2'
								)
							"
						>
							<template #help>
								Maximal zulässiger Strom für die Phase 3 dieses
								(Zwischen-)Zählers.
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
						diese openWB im Modus "Nur Ladepunkt" befindet.
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
							<pre>{{
								JSON.stringify(
									$store.state.mqtt[
										"openWB/counter/get/hierarchy"
									],
									undefined,
									2
								)
							}}</pre>
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
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import SortableList from "@/components/OpenwbSortableList.vue";

export default {
	name: "LoadManagementConfig",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		SortableList,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/counter/get/hierarchy",
				"openWB/system/device/+/component/+/config",
				"openWB/counter/+/config/max_currents",
				"openWB/counter/+/config/max_total_power",
				"openWB/chargepoint/+/config",
			],
		};
	},
	computed: {
		counterConfigs: {
			get() {
				let installedComponentsConfigs = this.getWildcardTopics(
					"openWB/system/device/+/component/+/config"
				);
				return Object.keys(installedComponentsConfigs)
					.filter((key) => {
						return installedComponentsConfigs[key].type.includes(
							"counter"
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
					this.$store.state.mqtt["openWB/counter/get/hierarchy"]
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
							"/config$"
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
						"^openWB/chargepoint/" + chargePointIndex + "/config$"
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
