<template>
	<!-- modal dialogs -->
	<openwb-base-modal-dialog
		:show="showChargePointModal"
		title="Ladepunkt löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="removeChargePoint(modalChargePointIndex, $event)"
	>
		Wollen Sie den Ladepunkt "{{
			getChargePointName(modalChargePointIndex)
		}}" (ID: {{ modalChargePointIndex }}) wirklich entfernen? Dieser Vorgang
		kann nicht rückgängig gemacht werden!
	</openwb-base-modal-dialog>
	<openwb-base-modal-dialog
		:show="showChargePointTemplateModal"
		title="Ladepunkt-Vorlage löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="
			removeChargePointTemplate(modalChargePointTemplateIndex, $event)
		"
	>
		Wollen Sie die Ladepunkt-Vorlage "{{
			getChargePointTemplateName(modalChargePointTemplateIndex)
		}}" (ID: {{ modalChargePointTemplateIndex }}) wirklich entfernen? Dieser
		Vorgang kann nicht rückgängig gemacht werden!
	</openwb-base-modal-dialog>
	<openwb-base-modal-dialog
		:show="showChargePointTemplateAutolockPlanModal"
		title="Autolock Zeitplan löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="
			removeChargePointTemplateAutolockPlan(
				modalChargePointTemplateIndex,
				modalChargePointTemplateAutolockPlanIndex,
				$event
			)
		"
	>
		Wollen Sie den Autolock Zeitplan "{{
			getChargePointTemplateAutolockPlanName(
				modalChargePointTemplateIndex,
				modalChargePointTemplateAutolockPlanIndex
			)
		}}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
		werden!
	</openwb-base-modal-dialog>
	<!-- main content -->
	<div class="chargePointInstallation">
		<form name="chargePointInstallationForm">
			<!-- charge point card -->
			<openwb-base-card
				title="Ladepunkte"
				subtype="primary"
				:collapsible="true"
				:collapsed="true"
			>
				<openwb-base-select-input
					class="mb-2"
					title="Verfügbare Ladepunkte"
					notSelected="Bitte auswählen"
					:options="getChargePointList()"
					:model-value="chargePointToAdd"
					@update:model-value="chargePointToAdd = $event"
				>
					<template #append>
						<span class="col-1">
							<openwb-base-click-button
								:class="
									chargePointToAdd === undefined
										? 'btn-outline-success'
										: 'btn-success'
								"
								:disabled="chargePointToAdd === undefined"
								@buttonClicked="addChargePoint"
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
						installedChargePoint, installedChargePointKey
					) in installedChargePoints"
					:key="installedChargePointKey"
					:title="
						installedChargePoint.name +
						' (ID: ' +
						installedChargePoint.id +
						')'
					"
					:collapsible="true"
					:collapsed="true"
					subtype="primary"
				>
					<template #actions>
						<openwb-base-avatar
							class="bg-danger clickable"
							@click="
								removeChargePointModal(
									installedChargePointKey,
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
						:model-value="installedChargePoint.name"
						@update:model-value="
							updateState(installedChargePointKey, $event, 'name')
						"
					/>
					<openwb-base-select-input
						title="Ladepunkt-Vorlage"
						:options="chargePointTemplateList"
						:model-value="
							$store.state.mqtt[installedChargePointKey].template
						"
						@update:model-value="
							updateState(
								installedChargePointKey,
								$event,
								'template'
							)
						"
					/>
					<hr />
					<openwb-charge-point-proxy
						:chargePointId="installedChargePoint.id"
						:chargePointType="
							$store.state.mqtt[installedChargePointKey].type
						"
						:configuration="
							installedChargePoint.connection_module.configuration
						"
						@update:configuration="
							updateConfiguration(installedChargePointKey, $event)
						"
					/>
					<hr />
					<!-- <openwb-base-text-input
						title="Leistungsmodul"
						subtype="text"
						:model-value="installedChargePoint.power_module.type"
						@update:model-value="
							updateState(
								installedChargePointKey,
								$event,
								'power_module.type'
							)
						"
						disabled
					/>
					<hr /> -->
					<openwb-base-heading>Hardware-Optionen</openwb-base-heading>
					<openwb-base-button-group-input
						title="automatische Phasenumschaltung vorhanden"
						:buttons="[
							{ buttonValue: false, text: 'Nein' },
							{ buttonValue: true, text: 'Ja' },
						]"
						:model-value="installedChargePoint.auto_phase_switch_hw"
						@update:model-value="
							updateState(
								installedChargePointKey,
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
							installedChargePoint.control_pilot_interruption_hw
						"
						@update:model-value="
							updateState(
								installedChargePointKey,
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
						:model-value="installedChargePoint.connected_phases"
						@update:model-value="
							updateState(
								installedChargePointKey,
								$event,
								'connected_phases'
							)
						"
					/>
					<openwb-base-button-group-input
						title="Phase 1"
						:buttons="[
							{
								buttonValue: 0,
								text: 'unbekannt',
								class: 'btn-outline-danger',
							},
							{
								buttonValue: 1,
								text: 'EVU L1',
								class: 'btn-outline-success',
							},
							{
								buttonValue: 2,
								text: 'EVU L2',
								class: 'btn-outline-success',
							},
							{
								buttonValue: 3,
								text: 'EVU L3',
								class: 'btn-outline-success',
							},
						]"
						:model-value="installedChargePoint.phase_1"
						@update:model-value="
							updateState(
								installedChargePointKey,
								$event,
								'phase_1'
							)
						"
					>
						<template #help>
							Hier ist anzugeben, an welcher Phase am
							Hausanschluss die Phase 1 dieses Ladepunktes
							angeschlossen ist. Diese Information wird für das
							Lastmanagement benötigt, um bei einer Schieflast
							gezielt einzelne Ladepunkte zu drosseln.<br />
							Bei mehreren Ladepunkten macht es Sinn, die Phasen
							rotierend anzuschließen, damit mehrere nicht
							dreiphasig ladende Fahrzeuge mit optimaler Leistung
							laden können, bevor das Lastmanagement eingreift.<br />
							Es wird vorausgesetzt, dass das Drehfeld innerhalb
							der Installation gleich bleibt. Wenn demnach L1 des
							Ladepunktes auf EVU L2 liegt, muss L2 des
							Ladepunktes auf EVU L3 aufgelegt sein.<br />
							Eine Möglichkeit, den Anschluss von L1 zu ermitteln,
							ist eine einphasige Ladung zu starten und die
							Phasenströme am EVU-Zähler zu beobachten. Mit einem
							zweiphasig ladenden Fahrzeug kann danach auch der
							Anschluss von L2 ermittelt und so das Drehfeld
							kontrolliert werden.<br />
							Im Zweifel bitte das Drehfeld von einer Fachkraft
							prüfen und korrigieren lassen.
						</template>
					</openwb-base-button-group-input>
				</openwb-base-card>
			</openwb-base-card>
			<hr class="border-secondary" />
			<!-- charge point template card -->
			<openwb-base-card
				title="Ladepunkt-Vorlagen"
				:collapsible="true"
				:collapsed="true"
			>
				<template #header>
					<span style="font-style: italic">Ladepunkt-Vorlagen</span>
				</template>
				<template #actions>
					<openwb-base-avatar
						class="bg-success clickable"
						v-if="
							$store.state.mqtt['openWB/general/extern'] === false
						"
						@click="addChargePointTemplate"
					>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'plus']"
						/>
					</openwb-base-avatar>
				</template>
				<openwb-base-card
					v-for="(
						chargePointTemplate, chargePointTemplateKey
					) in chargePointTemplates"
					:key="chargePointTemplateKey"
					:title="
						chargePointTemplate.name +
						' (ID: ' +
						getChargePointTemplateIndex(chargePointTemplateKey) +
						')'
					"
					:collapsible="true"
					:collapsed="true"
					subtype="primary"
				>
					<template
						#actions
						v-if="!chargePointTemplateKey.endsWith('/0')"
					>
						<openwb-base-avatar
							class="bg-danger clickable"
							@click="
								removeChargePointTemplateModal(
									chargePointTemplateKey,
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
						:model-value="chargePointTemplate.name"
						@update:model-value="
							updateState(chargePointTemplateKey, $event, 'name')
						"
						:disabled="chargePointTemplateKey.endsWith('/0')"
					>
						<template
							#help
							v-if="chargePointTemplateKey.endsWith('/0')"
						>
							Die Standard-Vorlage kann nicht umbenannt werden.
						</template>
					</openwb-base-text-input>
					<hr />
					<div
						v-if="
							$store.state.mqtt['openWB/optional/rfid/active'] ===
							true
						"
					>
						<openwb-base-heading>
							Zugangskontrolle
						</openwb-base-heading>
						<openwb-base-button-group-input
							title="Freigabe mit RFID"
							:buttons="[
								{ buttonValue: false, text: 'Nein' },
								{ buttonValue: true, text: 'Ja' },
							]"
							:model-value="chargePointTemplate.rfid_enabling"
							@update:model-value="
								updateState(
									chargePointTemplateKey,
									$event,
									'rfid_enabling'
								)
							"
						/>
						<openwb-base-array-input
							title="Zugeordnete Tags"
							noElementsMessage="Keine Tags zugeordnet."
							:model-value="chargePointTemplate.valid_tags"
							@update:model-value="
								updateState(
									chargePointTemplateKey,
									$event,
									'valid_tags'
								)
							"
						/>
						<hr />
					</div>
					<openwb-base-heading
						>Automatische Sperre</openwb-base-heading
					>
					<openwb-base-button-group-input
						title="Automatische Sperre aktiv"
						:buttons="[
							{ buttonValue: false, text: 'Nein' },
							{ buttonValue: true, text: 'Ja' },
						]"
						:model-value="chargePointTemplate.autolock.active"
						@update:model-value="
							updateState(
								chargePointTemplateKey,
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
							chargePointTemplate.autolock.wait_for_charging_end
						"
						@update:model-value="
							updateState(
								chargePointTemplateKey,
								$event,
								'autolock.wait_for_charging_end'
							)
						"
					>
						<template #help>
							Wenn ein Zeitplan die automatische Sperre aktiviert,
							werden alle Ladepunkte direkt gesperrt und laufende
							Ladevorgänge beendet. Wird hier "Ja" ausgewählt,
							dann werden laufende Ladevorgänge nicht beendet, und
							diese Ladepunkte erst nach abgeschlossener Ladung
							gesperrt.
						</template>
					</openwb-base-button-group-input>
					<openwb-base-heading>
						Zeitpläne für die automatische Sperre
						<template #actions>
							<openwb-base-avatar
								class="bg-success clickable"
								@click="
									addChargePointTemplateAutolockPlan(
										chargePointTemplateKey,
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
						) in getChargePointTemplateAutolockPlans(
							chargePointTemplateKey
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
									autolockPlan.active
										? 'bg-success'
										: 'bg-danger'
								"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'clock']"
								/>
								{{ autolockPlan.time[0] }} -
								{{ autolockPlan.time[1] }}
								<span
									v-if="
										autolockPlan.frequency.selected ==
										'once'
									"
								>
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'calendar-day']"
									/>
									{{
										formatDate(
											autolockPlan.frequency.once[0]
										) ==
										formatDate(
											autolockPlan.frequency.once[1]
										)
											? formatDate(
													autolockPlan.frequency
														.once[0]
											  )
											: formatDate(
													autolockPlan.frequency
														.once[0]
											  ) +
											  " - " +
											  formatDate(
													autolockPlan.frequency
														.once[1]
											  )
									}}
								</span>
								<span
									v-if="
										autolockPlan.frequency.selected ==
										'daily'
									"
								>
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'calendar-week']"
									/>
								</span>
								<span
									v-if="
										autolockPlan.frequency.selected ==
										'weekly'
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
								class="bg-danger clickable"
								@click="
									removeChargePointTemplateAutolockPlanModal(
										chargePointTemplateKey,
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
				formName="chargePointInstallationForm"
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
	faPlus as fasPlus,
	faTrash as fasTrash,
	faCalendarDay as fasCalendarDay,
	faCalendarAlt as fasCalendarAlt,
	faCalendarWeek as fasCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus, fasTrash, fasCalendarDay, fasCalendarAlt, fasCalendarWeek);

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import OpenwbChargePointProxy from "@/components/charge_points/OpenwbChargePointProxy.vue";

export default {
	name: "OpenwbChargePointInstallation",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		FontAwesomeIcon,
		OpenwbChargePointProxy,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/optional/rfid/active",
				"openWB/chargepoint/+/config",
				"openWB/chargepoint/template/+",
				"openWB/chargepoint/template/+/autolock/+",
				"openWB/system/configurable/chargepoints",
			],
			chargePointToAdd: undefined,
			showChargePointModal: false,
			modalChargePointIndex: undefined,
			showChargePointTemplateModal: false,
			modalChargePointTemplateIndex: undefined,
			showChargePointTemplateAutolockPlanModal: false,
			modalChargePointTemplateAutolockPlanIndex: undefined,
		};
	},
	computed: {
		installedChargePoints: {
			get() {
				return this.getWildcardTopics("openWB/chargepoint/+/config");
			},
		},
		chargePointTemplates: {
			get() {
				return this.getWildcardTopics("openWB/chargepoint/template/+");
			},
		},
		chargePointTemplateList: {
			get() {
				let myList = [];
				Object.keys(this.chargePointTemplates).forEach((key) => {
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
		addChargePoint(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.$emit("sendCommand", {
				command: "addChargepoint",
				data: { type: this.chargePointToAdd },
			});
		},
		removeChargePointModal(chargePoint, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.modalChargePointIndex = parseInt(
				chargePoint.match(/(?:\/)(\d+)(?=\/)/)[1]
			);
			this.showChargePointModal = true;
		},
		removeChargePoint(chargePointIndex, event) {
			this.showChargePointModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of charge point '" + chargePointIndex + "'"
				);
				this.$emit("sendCommand", {
					command: "removeChargepoint",
					data: { id: chargePointIndex },
				});
			}
		},
		getChargePointList() {
			return this.$store.state.mqtt[
				"openWB/system/configurable/chargepoints"
			];
		},
		getChargePointName(chargePointIndex) {
			return this.$store.state.mqtt[
				"openWB/chargepoint/" + chargePointIndex + "/config"
			]
				? this.$store.state.mqtt[
						"openWB/chargepoint/" + chargePointIndex + "/config"
				  ].name
				: "Ladepunkt " + chargePointIndex;
		},
		getChargePointTemplateName(chargePointTemplateIndex) {
			return this.$store.state.mqtt[
				"openWB/chargepoint/template/" + chargePointTemplateIndex
			]
				? this.$store.state.mqtt[
						"openWB/chargepoint/template/" +
							chargePointTemplateIndex
				  ].name
				: "Vorlage " + chargePointTemplateIndex;
		},
		addChargePointTemplate(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.$emit("sendCommand", {
				command: "addChargepointTemplate",
				data: {},
			});
		},
		getChargePointTemplateIndex(chargePointTemplate) {
			// get trailing characters as index
			return parseInt(chargePointTemplate.match(/([^/]+)$/)[0]);
		},
		removeChargePointTemplateModal(chargePointTemplate, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.modalChargePointTemplateIndex =
				this.getChargePointTemplateIndex(chargePointTemplate);
			this.showChargePointTemplateModal = true;
		},
		removeChargePointTemplate(chargePointTemplateIndex, event) {
			this.showChargePointTemplateModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of chargePoint template '" +
						chargePointTemplateIndex +
						"'"
				);
				this.$emit("sendCommand", {
					command: "removeChargepointTemplate",
					data: { id: chargePointTemplateIndex },
				});
			}
		},
		addChargePointTemplateAutolockPlan(chargePointTemplate, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info(
				"requesting new charge point template autolock plan..."
			);
			let chargePointTemplateIndex =
				this.getChargePointTemplateIndex(chargePointTemplate);
			this.$emit("sendCommand", {
				command: "addAutolockPlan",
				data: { template: chargePointTemplateIndex },
			});
		},
		removeChargePointTemplateAutolockPlanModal(
			chargePointTemplate,
			autolockPlan,
			event
		) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.modalChargePointTemplateIndex =
				this.getChargePointTemplateIndex(chargePointTemplate);
			this.modalChargePointTemplateAutolockPlanIndex = parseInt(
				autolockPlan.match(/([^/]+)$/)[0]
			);
			this.showChargePointTemplateAutolockPlanModal = true;
		},
		removeChargePointTemplateAutolockPlan(
			chargePointTemplateIndex,
			autolockPlanIndex,
			event
		) {
			this.showChargePointTemplateAutolockPlanModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of chargePoint template '" +
						chargePointTemplateIndex +
						"' autolock plan '" +
						autolockPlanIndex +
						"'"
				);
				this.$emit("sendCommand", {
					command: "removeAutolockPlan",
					data: {
						template: chargePointTemplateIndex,
						plan: autolockPlanIndex,
					},
				});
			}
		},
		getChargePointTemplateAutolockPlanName(templateIndex, planIndex) {
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
		getChargePointTemplateAutolockPlans(chargePointTemplate) {
			let chargePointTemplateIndex =
				this.getChargePointTemplateIndex(chargePointTemplate);
			let result = this.getWildcardTopics(
				"openWB/chargepoint/template/" +
					chargePointTemplateIndex +
					"/autolock/+"
			);
			return result;
		},
		updateConfiguration(key, event) {
			console.debug("updateConfiguration", key, event);
			this.updateState(key, event.value, event.object);
		},
	},
};
</script>

<style scoped>
.clickable {
	cursor: pointer;
}
</style>
