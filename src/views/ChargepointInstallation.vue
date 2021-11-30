<template>
	<!-- modal dialogs -->
	<openwb-base-modal-dialog
		:show="showChargepointModal"
		title="Ladepunkt löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="removeChargepoint(modalChargepointIndex, $event)"
	>
		Wollen Sie den Ladepunkt "{{
			getChargepointName(modalChargepointIndex)
		}}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
		werden!
	</openwb-base-modal-dialog>
	<openwb-base-modal-dialog
		:show="showChargepointTemplateModal"
		title="Ladepunkt-Vorlage löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="
			removeChargepointTemplate(modalChargepointTemplateIndex, $event)
		"
	>
		Wollen Sie die Ladepunkt-Vorlage "{{
			getChargepointTemplateName(modalChargepointTemplateIndex)
		}}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
		werden!
	</openwb-base-modal-dialog>
	<openwb-base-modal-dialog
		:show="showChargepointTemplateAutolockPlanModal"
		title="Autolock Zeitplan löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="
			removeChargepointTemplateAutolockPlan(
				modalChargepointTemplateIndex,
				modalChargepointTemplateAutolockPlanIndex,
				$event
			)
		"
	>
		Wollen Sie den Autolock Zeitplan "{{
			getChargepointTemplateAutolockPlanName(
				modalChargepointTemplateIndex,
				modalChargepointTemplateAutolockPlanIndex
			)
		}}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
		werden!
	</openwb-base-modal-dialog>
	<!-- main content -->
	<div class="chargepoint-installation">
		<!-- chargepoint card -->
		<openwb-base-card
			title="Ladepunkte"
			:collapsible="true"
			:collapsed="true"
		>
			<openwb-base-select-input
				class="mb-2"
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
			<openwb-base-card
				v-for="(
					installedChargepoint, installedChargepointKey
				) in installedChargepoints"
				:key="installedChargepointKey"
				:title="installedChargepoint.name"
				:collapsible="true"
				:collapsed="true"
				subtype="primary"
			>
				<template #actions>
					<openwb-base-avatar
						class="bg-danger"
						@click="
							removeChargepointModal(
								installedChargepointKey,
								$event
							)
						"
					>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'trash']"
						/>
					</openwb-base-avatar>
				</template>
				<openwb-base-text-input
					title="Bezeichnung"
					subtype="text"
					:model-value="installedChargepoint.name"
					@update:model-value="
						updateState(installedChargepointKey, $event, 'name')
					"
				/>
				<openwb-base-select-input
					title="Ladepunkt-Vorlage"
					:options="chargepointTemplateList"
					:model-value="
						$store.state.mqtt[installedChargepointKey].template
					"
					@update:model-value="
						updateState(installedChargepointKey, $event, 'template')
					"
				/>
				<hr />
				<openwb-base-text-input
					title="Verbindungsmodul"
					subtype="text"
					:model-value="
						installedChargepoint.connection_module.selected
					"
					@update:model-value="
						updateState(
							installedChargepointKey,
							$event,
							'connection_module.selected'
						)
					"
					disabled
				/>
				<openwb-base-text-input
					title="Leistungsmodul"
					subtype="text"
					:model-value="installedChargepoint.power_module.selected"
					@update:model-value="
						updateState(
							installedChargepointKey,
							$event,
							'power_module.selected'
						)
					"
					disabled
				/>
				<hr />
				<openwb-base-heading>Hardware-Optionen</openwb-base-heading>
				<openwb-base-button-group-input
					title="1/3-Phasenumschaltung vorhanden"
					:buttons="[
						{ buttonValue: false, text: 'Nein' },
						{ buttonValue: true, text: 'Ja' },
					]"
					:model-value="installedChargepoint.auto_phase_switch_hw"
					@update:model-value="
						updateState(
							installedChargepointKey,
							$event,
							'auto_phase_switch_hw'
						)
					"
				/>
				<openwb-base-button-group-input
					title="Control-Pilot-Unterbrechung vorhanden"
					:buttons="[
						{ buttonValue: false, text: 'Nein' },
						{ buttonValue: true, text: 'Ja' },
					]"
					:model-value="
						installedChargepoint.control_pilot_interruption_hw
					"
					@update:model-value="
						updateState(
							installedChargepointKey,
							$event,
							'control_pilot_interruption_hw'
						)
					"
				/>
				<openwb-base-heading>
					Elektrischer Anschluss
				</openwb-base-heading>
				<openwb-base-button-group-input
					title="Anzahl angeschlossener Phasen"
					:buttons="[
						{ buttonValue: 1, text: '1' },
						{ buttonValue: 2, text: '2' },
						{ buttonValue: 3, text: '3' },
					]"
					:model-value="installedChargepoint.connected_phases"
					@update:model-value="
						updateState(
							installedChargepointKey,
							$event,
							'connected_phases'
						)
					"
				/>
				<openwb-base-button-group-input
					title="Phase 1"
					:buttons="[
						{ buttonValue: 0, text: 'unbekannt' },
						{ buttonValue: 1, text: 'EVU L1' },
						{ buttonValue: 2, text: 'EVU L2' },
						{ buttonValue: 3, text: 'EVU L3' },
					]"
					:model-value="installedChargepoint.phase_1"
					@update:model-value="
						updateState(installedChargepointKey, $event, 'phase_1')
					"
				>
					<template #help>
						Hier ist anzugeben, an welcher Phase am Hausanschluss
						die Phase 1 dieses Ladepunktes angeschlossen ist. Diese
						Information wird für das Lastmanagement benötigt, um bei
						einer Schieflast gezielt einzelne Ladepunkte zu
						drosseln.<br />
						Bei mehreren Ladepunkten macht es Sinn, die Phasen
						rotierend anzuschließen, damit mehrere nicht dreiphasig
						ladende Fahrzeuge mit optimaler Leistung laden können,
						bevor das Lastmanagement eingreift.
					</template>
				</openwb-base-button-group-input>
			</openwb-base-card>
		</openwb-base-card>
		<!-- chargepoint template card -->
		<openwb-base-card
			title="Ladepunkt-Vorlagen"
			:collapsible="true"
			:collapsed="true"
		>
			<template #actions>
				<openwb-base-avatar
					class="bg-success"
					v-if="$store.state.mqtt['openWB/general/extern'] === false"
					@click="addChargepointTemplate"
				>
					<font-awesome-icon fixed-width :icon="['fas', 'plus']" />
				</openwb-base-avatar>
			</template>
			<openwb-base-card
				v-for="(
					chargepointTemplate, chargepointTemplateKey
				) in chargepointTemplates"
				:key="chargepointTemplateKey"
				:title="chargepointTemplate.name"
				:collapsible="true"
				:collapsed="true"
				subtype="primary"
			>
				<template
					#actions
					v-if="!chargepointTemplateKey.endsWith('/0')"
				>
					<openwb-base-avatar
						class="bg-danger"
						@click="
							removeChargepointTemplateModal(
								chargepointTemplateKey,
								$event
							)
						"
					>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'trash']"
						/>
					</openwb-base-avatar>
				</template>
				<openwb-base-text-input
					title="Bezeichnung"
					subtype="text"
					:model-value="chargepointTemplate.name"
					@update:model-value="
						updateState(chargepointTemplateKey, $event, 'name')
					"
					:disabled="chargepointTemplateKey.endsWith('/0')"
				>
					<template
						#help
						v-if="chargepointTemplateKey.endsWith('/0')"
					>
						Die Standard-Vorlage kann nicht umbenannt werden.
					</template>
				</openwb-base-text-input>
				<hr />
				<openwb-base-heading>RFID</openwb-base-heading>
				<openwb-base-button-group-input
					title="Freigabe mit RFID"
					:buttons="[
						{ buttonValue: false, text: 'Nein' },
						{ buttonValue: true, text: 'Ja' },
					]"
					:model-value="chargepointTemplate.rfid_enabling"
					@update:model-value="
						updateState(
							chargepointTemplateKey,
							$event,
							'rfid_enabling'
						)
					"
				/>
				<openwb-base-array-input
					title="Zugeordnete Tags"
					noElementsMessage="Keine Tags zugeordnet."
					:model-value="chargepointTemplate.valid_tags"
					@update:model-value="
						updateState(
							chargepointTemplateKey,
							$event,
							'valid_tags'
						)
					"
				/>
				<hr />
				<openwb-base-heading>Autolock</openwb-base-heading>
				<openwb-base-button-group-input
					title="Autolock aktiv"
					:buttons="[
						{ buttonValue: false, text: 'Nein' },
						{ buttonValue: true, text: 'Ja' },
					]"
					:model-value="chargepointTemplate.autolock.active"
					@update:model-value="
						updateState(
							chargepointTemplateKey,
							$event,
							'autolock.active'
						)
					"
				/>
				<openwb-base-button-group-input
					title="Erst nach Ladeende sperren"
					:buttons="[
						{ buttonValue: false, text: 'Nein' },
						{ buttonValue: true, text: 'Ja' },
					]"
					:model-value="
						chargepointTemplate.autolock.wait_for_charging_end
					"
					@update:model-value="
						updateState(
							chargepointTemplateKey,
							$event,
							'autolock.wait_for_charging_end'
						)
					"
				/>
				<openwb-base-heading>
					Autolock Zeitpläne
					<template #actions>
						<openwb-base-avatar
							class="bg-success"
							@click="
								addChargepointTemplateAutolockPlan(
									chargepointTemplateKey,
									$event
								)
							"
						>
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'plus']"
							/>
						</openwb-base-avatar>
					</template>
				</openwb-base-heading>
				<openwb-base-card
					v-for="(
						autolockPlan, autolockPlanKey
					) in getChargepointTemplateAutolockPlans(
						chargepointTemplateKey
					)"
					:key="autolockPlanKey"
					:title="autolockPlan.name"
					:collapsible="true"
					:collapsed="true"
				>
					<template #actions="slotProps">
						<span
							v-if="slotProps.collapsed == true"
							class="subheader pill"
							:class="
								autolockPlan.active ? 'bg-success' : 'bg-danger'
							"
						>
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'clock']"
							/>
							{{ autolockPlan.time[0] }} -
							{{ autolockPlan.time[1] }}
							<span
								v-if="autolockPlan.frequency.selected == 'once'"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'calendar-day']"
								/>
								{{
									formatDate(
										autolockPlan.frequency.once[0]
									) ==
									formatDate(autolockPlan.frequency.once[1])
										? formatDate(
												autolockPlan.frequency.once[0]
										  )
										: formatDate(
												autolockPlan.frequency.once[0]
										  ) +
										  "-" +
										  formatDate(
												autolockPlan.frequency.once[1]
										  )
								}}
							</span>
							<span
								v-if="
									autolockPlan.frequency.selected == 'daily'
								"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'calendar-week']"
								/>
							</span>
							<span
								v-if="
									autolockPlan.frequency.selected == 'weekly'
								"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'calendar-alt']"
								/>
							</span>
						</span>
						<openwb-base-avatar
							v-if="slotProps.collapsed == false"
							class="bg-danger"
							@click="
								removeChargepointTemplateAutolockPlanModal(
									chargepointTemplateKey,
									autolockPlanKey,
									$event
								)
							"
						>
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'trash']"
							/>
						</openwb-base-avatar>
					</template>
					<openwb-base-text-input
						title="Bezeichnung"
						:model-value="autolockPlan.name"
						@update:model-value="
							updateState(autolockPlanKey, $event, 'name')
						"
					>
					</openwb-base-text-input>
					<openwb-base-button-group-input
						title="Zeitplan aktiv"
						:buttons="[
							{
								buttonValue: false,
								text: 'Nein',
								class: 'btn-outline-danger',
							},
							{
								buttonValue: true,
								text: 'Ja',
								class: 'btn-outline-success',
							},
						]"
						:model-value="autolockPlan.active"
						@update:model-value="
							updateState(autolockPlanKey, $event, 'active')
						"
					>
					</openwb-base-button-group-input>
					<openwb-base-text-input
						title="Sperren um"
						subtype="time"
						:model-value="autolockPlan.time[0]"
						@update:model-value="
							updateState(autolockPlanKey, $event, 'time.0')
						"
					>
					</openwb-base-text-input>
					<openwb-base-text-input
						title="Freigeben um"
						subtype="time"
						:model-value="autolockPlan.time[1]"
						@update:model-value="
							updateState(autolockPlanKey, $event, 'time.1')
						"
					>
					</openwb-base-text-input>
					<openwb-base-button-group-input
						title="Wiederholungen"
						:buttons="[
							{
								buttonValue: 'once',
								text: 'Einmalig',
								class: 'btn-outline-info',
							},
							{
								buttonValue: 'daily',
								text: 'Täglich',
								class: 'btn-outline-info',
							},
							{
								buttonValue: 'weekly',
								text: 'Wöchentlich',
								class: 'btn-outline-info',
							},
						]"
						:model-value="autolockPlan.frequency.selected"
						@update:model-value="
							updateState(
								autolockPlanKey,
								$event,
								'frequency.selected'
							)
						"
					>
					</openwb-base-button-group-input>
					<openwb-base-text-input
						v-if="autolockPlan.frequency.selected == 'once'"
						title="Sperren ab ..."
						subtype="date"
						:model-value="autolockPlan.frequency.once[0]"
						@update:model-value="
							updateState(
								autolockPlanKey,
								$event,
								'frequency.once.0'
							)
						"
					/>
					<openwb-base-text-input
						v-if="autolockPlan.frequency.selected == 'once'"
						title="... bis"
						subtype="date"
						:min="autolockPlan.frequency.once[0]"
						:model-value="autolockPlan.frequency.once[1]"
						@update:model-value="
							updateState(
								autolockPlanKey,
								$event,
								'frequency.once.1'
							)
						"
					/>
					<div v-if="autolockPlan.frequency.selected == 'weekly'">
						<openwb-base-button-group-input
							v-for="(day, dayIndex) in weekdays"
							:key="dayIndex"
							:title="day"
							:buttons="[
								{
									buttonValue: false,
									text: 'Aus',
									class: 'btn-outline-danger',
								},
								{
									buttonValue: true,
									text: 'An',
									class: 'btn-outline-success',
								},
							]"
							:model-value="
								autolockPlan.frequency.weekly[dayIndex]
							"
							@update:model-value="
								updateState(
									autolockPlanKey,
									$event,
									'frequency.weekly.' + dayIndex
								)
							"
						>
						</openwb-base-button-group-input>
					</div>
				</openwb-base-card>
			</openwb-base-card>
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
import {
	faPlus as fasPlus,
	faTrash as fasTrash,
	faCalendarDay as fasCalendarDay,
	faCalendarAlt as fasCalendarAlt,
	faCalendarWeek as fasCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus, fasTrash, fasCalendarDay, fasCalendarAlt, fasCalendarWeek);

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
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/chargepoint/+/config",
				"openWB/chargepoint/template/+",
				"openWB/chargepoint/template/+/autolock/+",
				"openWB/system/configurable/chargepoints",
			],
			chargepointToAdd: undefined,
			showChargepointModal: false,
			modalChargepointIndex: undefined,
			showChargepointTemplateModal: false,
			modalChargepointTemplateIndex: undefined,
			showChargepointTemplateAutolockPlanModal: false,
			modalChargepointTemplateAutolockPlanIndex: undefined,
		};
	},
	computed: {
		installedChargepoints: {
			get() {
				return this.getWildcardTopics("openWB/chargepoint/+/config");
			},
		},
		chargepointTemplates: {
			get() {
				return this.getWildcardTopics("openWB/chargepoint/template/+");
			},
		},
		chargepointTemplateList: {
			get() {
				let myList = [];
				Object.keys(this.chargepointTemplates).forEach((key) => {
					// console.log(key);
					let index = parseInt(key.match(/([0-9]+)/g)[0]);
					let name =
						this.$store.state.mqtt[
							"openWB/chargepoint/template/" + index
						].name;
					// console.log("index: " + index, "name: " + name);
					myList.push({ value: index, text: name });
				});
				return myList;
			},
		},
	},
	methods: {
		addChargepoint(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.$emit("sendCommand", {
				command: "addChargepoint",
				data: {},
			});
		},
		removeChargepointModal(chargepoint, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.log("removeChargepointModal");
			this.modalChargepointIndex = parseInt(
				chargepoint.match(/(?:\/)(\d+)(?=\/)/)[1]
			);
			this.showChargepointModal = true;
		},
		removeChargepoint(chargepointIndex, event) {
			this.showChargepointModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of chargepoint '" + chargepointIndex + "'"
				);
				this.$emit("sendCommand", {
					command: "removeChargepoint",
					data: { id: chargepointIndex },
				});
			}
		},
		getChargepointList() {
			return this.$store.state.mqtt[
				"openWB/system/configurable/chargepoints"
			];
		},
		getChargepointName(chargepointIndex) {
			return this.$store.state.mqtt[
				"openWB/chargepoint/" + chargepointIndex
			]
				? this.$store.state.mqtt[
						"openWB/chargepoint/" + chargepointIndex
				  ].name
				: "Ladepunkt " + chargepointIndex;
		},
		getChargepointTemplateName(chargepointTemplateIndex) {
			return this.$store.state.mqtt[
				"openWB/chargepoint/template/" + chargepointTemplateIndex
			]
				? this.$store.state.mqtt[
						"openWB/chargepoint/template/" +
							chargepointTemplateIndex
				  ].name
				: "Vorlage " + chargepointTemplateIndex;
		},
		addChargepointTemplate(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.$emit("sendCommand", {
				command: "addChargepointTemplate",
				data: {},
			});
		},
		removeChargepointTemplateModal(chargepointTemplate, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.log("removeChargepointTemplateModal");
			// get trailing characters as index
			this.modalChargepointTemplateIndex = parseInt(
				chargepointTemplate.match(/([^/]+)$/)[0]
			);
			this.showChargepointTemplateModal = true;
		},
		removeChargepointTemplate(chargepointTemplateIndex, event) {
			this.showChargepointTemplateModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of chargepoint template '" +
						chargepointTemplateIndex +
						"'"
				);
				this.$emit("sendCommand", {
					command: "removeChargepointTemplate",
					data: { id: chargepointTemplateIndex },
				});
			}
		},
		addChargepointTemplateAutolockPlan(chargepointTemplate, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info(
				"requesting new chargepoint template autolock plan..."
			);
			// get trailing characters as index
			let chargepointTemplateIndex = parseInt(
				chargepointTemplate.match(/([^/]+)$/)[0]
			);
			this.$emit("sendCommand", {
				command: "addAutolockPlan",
				data: { template: chargepointTemplateIndex },
			});
		},
		removeChargepointTemplateAutolockPlanModal(
			chargepointTemplate,
			autolockPlan,
			event
		) {
			// prevent further processing of the click event
			event.stopPropagation();
			// get trailing characters as index
			this.modalChargepointTemplateIndex = parseInt(
				chargepointTemplate.match(/([^/]+)$/)[0]
			);
			this.modalChargepointTemplateAutolockPlanIndex = parseInt(
				autolockPlan.match(/([^/]+)$/)[0]
			);
			this.showChargepointTemplateAutolockPlanModal = true;
		},
		removeChargepointTemplateAutolockPlan(
			chargepointTemplateIndex,
			autolockPlanIndex,
			event
		) {
			this.showChargepointTemplateAutolockPlanModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of chargepoint template '" +
						chargepointTemplateIndex +
						"' autolock plan '" +
						autolockPlanIndex +
						"'"
				);
				this.$emit("sendCommand", {
					command: "removeAutolockPlan",
					data: {
						template: chargepointTemplateIndex,
						plan: autolockPlanIndex,
					},
				});
			}
		},
		getChargepointTemplateAutolockPlanName(templateIndex, planIndex) {
			return this.$store.state.mqtt[
				"openWB/chargepoint/template/" +
					templateIndex +
					"/autolock/" +
					planIndex
			]
				? this.$store.state.mqtt[
						"openWB/chargepoint/template/" +
							templateIndex +
							"/autolock/" +
							planIndex
				  ].name
				: "Autolock Zeitplan " + templateIndex + "/" + planIndex;
		},
		getChargepointTemplateAutolockPlans(chargepointTemplate) {
			// get trailing characters as index
			let chargepointTemplateIndex =
				chargepointTemplate.match(/([^/]+)$/)[0];
			let result = this.getWildcardTopics(
				"openWB/chargepoint/template/" +
					chargepointTemplateIndex +
					"/autolock/+"
			);
			return result;
		},
	},
};
</script>

<style></style>
