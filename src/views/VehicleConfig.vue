<template>
	<!-- modal dialogs -->
	<openwb-base-modal-dialog
		:show="showVehicleModal"
		title="Fahrzeug löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="removeVehicle(modalVehicleIndex, $event)"
	>
		Wollen Sie das Fahrzeug "{{ getVehicleName(modalVehicleIndex) }}"
		wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden!
	</openwb-base-modal-dialog>
	<openwb-base-modal-dialog
		:show="showEvTemplateModal"
		title="Fahrzeug-Vorlage löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="removeEvTemplate(modalEvTemplateIndex, $event)"
	>
		Wollen Sie die Fahrzeug-Vorlage "{{
			getEvTemplateName(modalEvTemplateIndex)
		}}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
		werden!
	</openwb-base-modal-dialog>
	<openwb-base-modal-dialog
		:show="showChargeTemplateModal"
		title="Ladeprofil-Vorlage löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="removeChargeTemplate(modalChargeTemplateIndex, $event)"
	>
		Wollen Sie die Ladeprofil-Vorlage "{{
			getChargeTemplateName(modalChargeTemplateIndex)
		}}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
		werden!
	</openwb-base-modal-dialog>
	<openwb-base-modal-dialog
		:show="showChargeTemplateSchedulePlanModal"
		title="Zielladen Zeitplan löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="
			removeChargeTemplateSchedulePlan(
				modalChargeTemplateIndex,
				modalChargeTemplateSchedulePlanIndex,
				$event
			)
		"
	>
		Wollen Sie den Zielladen Zeitplan "{{
			getChargeTemplateSchedulePlanName(
				modalChargeTemplateIndex,
				modalChargeTemplateSchedulePlanIndex
			)
		}}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
		werden!
	</openwb-base-modal-dialog>
	<openwb-base-modal-dialog
		:show="showChargeTemplateTimeChargingPlanModal"
		title="Zeitladen Zeitplan löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="
			removeChargeTemplateTimeChargingPlan(
				modalChargeTemplateIndex,
				modalChargeTemplateTimeChargingPlanIndex,
				$event
			)
		"
	>
		Wollen Sie den Zeitladen Zeitplan "{{
			getChargeTemplateTimeChargingPlanName(
				modalChargeTemplateIndex,
				modalChargeTemplateTimeChargingPlanIndex
			)
		}}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
		werden!
	</openwb-base-modal-dialog>
	<!-- main content -->
	<div class="vehicleConfig">
		<form name="vehicleConfigForm">
			<!-- vehicle card -->
			<openwb-base-card
				title="Fahrzeuge"
				:collapsible="true"
				:collapsed="true"
			>
				<template #actions>
					<openwb-base-avatar
						class="bg-success clickable"
						v-if="
							$store.state.mqtt['openWB/general/extern'] === false
						"
						@click="addVehicle"
					>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'plus']"
						/>
					</openwb-base-avatar>
				</template>
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-card
						v-for="vehicleId in vehicleIndexes"
						:key="vehicleId"
						:title="getVehicleName(vehicleId)"
						:collapsible="true"
						:collapsed="true"
						subtype="primary"
					>
						<template #actions v-if="vehicleId !== 0">
							<openwb-base-avatar
								class="bg-danger clickable"
								@click="removeVehicleModal(vehicleId, $event)"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'trash']"
								/>
							</openwb-base-avatar>
						</template>
						<openwb-base-text-input
							title="Bezeichnung"
							:model-value="
								$store.state.mqtt[
									'openWB/vehicle/' + vehicleId + '/name'
								]
							"
							@update:model-value="
								updateState(
									'openWB/vehicle/' + vehicleId + '/name',
									$event
								)
							"
							:disabled="vehicleId === 0"
						>
							<template #help v-if="vehicleId === 0">
								Das Standard-Fahrzeug kann nicht umbenannt
								werden.
							</template>
						</openwb-base-text-input>
						<openwb-base-select-input
							title="Fahrzeug-Vorlage"
							:options="evTemplateList"
							:model-value="
								$store.state.mqtt[
									'openWB/vehicle/' +
										vehicleId +
										'/ev_template'
								]
							"
							@update:model-value="
								updateState(
									'openWB/vehicle/' +
										vehicleId +
										'/ev_template',
									$event
								)
							"
						/>
						<openwb-base-select-input
							title="Ladeprofil-Vorlage"
							:options="chargeTemplateList"
							:model-value="
								$store.state.mqtt[
									'openWB/vehicle/' +
										vehicleId +
										'/charge_template'
								]
							"
							@update:model-value="
								updateState(
									'openWB/vehicle/' +
										vehicleId +
										'/charge_template',
									$event
								)
							"
						/>
						<hr />
						<openwb-base-array-input
							title="Zugeordnete Tags"
							:model-value="
								$store.state.mqtt[
									'openWB/vehicle/' + vehicleId + '/tag_id'
								]
							"
							@update:model-value="
								updateState(
									'openWB/vehicle/' + vehicleId + '/tag_id',
									$event
								)
							"
						/>
						<hr />
						<openwb-base-select-input
							class="mb-2"
							title="SoC-Modul"
							:options="socModuleList"
							:model-value="
								$store.state.mqtt[
									'openWB/vehicle/' +
										vehicleId +
										'/soc_module/config'
								].type
							"
							@update:model-value="
								updateSelectedSocModule(vehicleId, $event)
							"
						>
							<template #help>
								Mit einem SoC-Modul kann der Ladestand des
								Fahrzeugs ermittelt werden.
							</template>
						</openwb-base-select-input>
						<openwb-config-proxy
							v-if="
								$store.state.mqtt[
									'openWB/vehicle/' +
										vehicleId +
										'/soc_module/config'
								].type
							"
							:deviceId="vehicleId"
							:deviceType="
								$store.state.mqtt[
									'openWB/vehicle/' +
										vehicleId +
										'/soc_module/config'
								].type
							"
							componentType="vehicle_soc"
							:configuration="
								$store.state.mqtt[
									'openWB/vehicle/' +
										vehicleId +
										'/soc_module/config'
								].configuration
							"
							@update:configuration="
								updateConfiguration(
									'openWB/vehicle/' +
										vehicleId +
										'/soc_module/config',
									$event
								)
							"
						/>
					</openwb-base-card>
				</div>
			</openwb-base-card>
			<!-- vehicle template card -->
			<openwb-base-card
				title="Fahrzeug-Vorlagen"
				:collapsible="true"
				:collapsed="true"
			>
				<template #actions>
					<openwb-base-avatar
						class="bg-success clickable"
						v-if="
							$store.state.mqtt['openWB/general/extern'] === false
						"
						@click="addEvTemplate"
					>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'plus']"
						/>
					</openwb-base-avatar>
				</template>
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-card
						v-for="(template, key) in evTemplates"
						:key="key"
						:title="template.name ? template.name : key"
						:collapsible="true"
						:collapsed="true"
						subtype="primary"
					>
						<template #actions v-if="!key.endsWith('/0')">
							<openwb-base-avatar
								class="bg-danger clickable"
								v-if="
									$store.state.mqtt[
										'openWB/general/extern'
									] === false
								"
								@click="removeEvTemplateModal(key, $event)"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'trash']"
								/>
							</openwb-base-avatar>
						</template>
						<openwb-base-text-input
							title="Bezeichnung"
							:model-value="template.name"
							@update:model-value="
								updateState(key, $event, 'name')
							"
							:disabled="key.endsWith('/0')"
						>
							<template #help v-if="key.endsWith('/0')">
								Die Standard-Vorlage kann nicht umbenannt
								werden.
							</template>
						</openwb-base-text-input>
						<openwb-base-heading>
							Angaben zum Ladestrom
						</openwb-base-heading>
						<openwb-base-range-input
							title="Mindeststrom"
							:min="6"
							:max="16"
							:step="1"
							unit="A"
							:model-value="template.min_current"
							@update:model-value="
								updateState(key, $event, 'min_current')
							"
						>
						</openwb-base-range-input>
						<openwb-base-range-input
							title="Maximalstrom bei einer Phase"
							:min="6"
							:max="32"
							:step="1"
							unit="A"
							:model-value="template.max_current_one_phase"
							@update:model-value="
								updateState(
									key,
									$event,
									'max_current_one_phase'
								)
							"
						>
						</openwb-base-range-input>
						<openwb-base-range-input
							title="Maximalstrom mehrere Phasen"
							:min="6"
							:max="32"
							:step="1"
							unit="A"
							:model-value="template.max_current_multi_phases"
							@update:model-value="
								updateState(
									key,
									$event,
									'max_current_multi_phases'
								)
							"
						>
						</openwb-base-range-input>
						<openwb-base-number-input
							title="Erlaubte Stromabweichung"
							unit="A"
							:model-value="template.nominal_difference"
							@update:model-value="
								updateState(key, $event, 'nominal_difference')
							"
						>
						</openwb-base-number-input>
						<openwb-base-heading>
							Angaben zur Batterie
						</openwb-base-heading>
						<openwb-base-number-input
							title="Kapazität der Batterie"
							unit="kWh"
							:min="10"
							:step="1"
							:model-value="template.battery_capacity"
							@update:model-value="
								updateState(key, $event, 'battery_capacity')
							"
						>
						</openwb-base-number-input>
						<openwb-base-number-input
							title="Durchschnittsverbrauch"
							unit="kWh&nbsp;/&nbsp;100km"
							:min="0"
							:step="0.1"
							:model-value="template.average_consump"
							@update:model-value="
								updateState(key, $event, 'average_consump')
							"
						>
						</openwb-base-number-input>
						<openwb-base-heading>
							Angaben zur Handhabung von Phasen
						</openwb-base-heading>
						<openwb-base-button-group-input
							title="Unterstützte Phasen"
							:buttons="[
								{ buttonValue: 1, text: '1' },
								{ buttonValue: 2, text: '2' },
								{ buttonValue: 3, text: '3' },
							]"
							:model-value="template.max_phases"
							@update:model-value="
								updateState(key, $event, 'max_phases')
							"
						>
						</openwb-base-button-group-input>
						<openwb-base-button-group-input
							title="CP-Unterbrechung"
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
							:model-value="template.control_pilot_interruption"
							@update:model-value="
								updateState(
									key,
									$event,
									'control_pilot_interruption'
								)
							"
						>
						</openwb-base-button-group-input>
						<openwb-base-number-input
							title="Dauer der CP-Unterbrechung"
							v-if="template.control_pilot_interruption"
							:min="4"
							:step="1"
							unit="s"
							:model-value="
								template.control_pilot_interruption_duration
							"
							@update:model-value="
								updateState(
									key,
									$event,
									'control_pilot_interruption_duration'
								)
							"
						>
						</openwb-base-number-input>
						<openwb-base-button-group-input
							title="Phasenumschaltung blockieren"
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
							:model-value="template.prevent_phase_switch"
							@update:model-value="
								updateState(key, $event, 'prevent_phase_switch')
							"
						>
						</openwb-base-button-group-input>
						<openwb-base-button-group-input
							title="Ladung aktiv halten"
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
							:model-value="template.prevent_charge_stop"
							@update:model-value="
								updateState(key, $event, 'prevent_charge_stop')
							"
						>
						</openwb-base-button-group-input>
						<openwb-base-number-input
							title="Pause bei Phasenumschaltung"
							unit="s"
							:min="2"
							:step="1"
							:model-value="template.phase_switch_pause"
							@update:model-value="
								updateState(key, $event, 'phase_switch_pause')
							"
						>
						</openwb-base-number-input>
					</openwb-base-card>
				</div>
			</openwb-base-card>
			<!-- charge template card -->
			<openwb-base-card
				title="Ladeprofil-Vorlagen"
				:collapsible="true"
				:collapsed="true"
			>
				<template #actions>
					<openwb-base-avatar
						class="bg-success clickable"
						v-if="
							$store.state.mqtt['openWB/general/extern'] === false
						"
						@click="addChargeTemplate"
					>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'plus']"
						/>
					</openwb-base-avatar>
				</template>
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-card
						v-for="(template, templateKey) in chargeTemplates"
						:key="templateKey"
						:title="template.name ? template.name : templateKey"
						:collapsible="true"
						:collapsed="true"
						subtype="primary"
					>
						<template #actions v-if="!templateKey.endsWith('/0')">
							<openwb-base-avatar
								class="bg-danger clickable"
								@click="
									removeChargeTemplateModal(
										templateKey,
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
							:model-value="template.name"
							@update:model-value="
								updateState(templateKey, $event, 'name')
							"
							:disabled="templateKey.endsWith('/0')"
						>
							<template #help v-if="templateKey.endsWith('/0')">
								Die Standard-Vorlage kann nicht umbenannt
								werden.
							</template>
						</openwb-base-text-input>
						<openwb-base-heading>
							Allgemeine Optionen
						</openwb-base-heading>
						<openwb-base-button-group-input
							title="Priorität"
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
							:model-value="template.prio"
							@update:model-value="
								updateState(templateKey, $event, 'prio')
							"
						>
							<template #help>
								Fahrzeuge mit Priorität werden bevorzugt
								geladen. Erst wenn alle priorisierten Fahrzeuge
								die maximale Ladeleistung bekommen und noch
								zusätzlicher Überschuss vorhanden ist, werden
								auch Fahrzeuge ohne Priorität geladen.
							</template>
						</openwb-base-button-group-input>
						<openwb-base-button-group-input
							title="Automatische Sperre"
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
							:model-value="template.disable_after_unplug"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'disable_after_unplug'
								)
							"
						>
							<template #help>
								Wird ein Fahrzeug mit diesem Profil abgesteckt,
								dann wird der betroffene Ladepunkt automatisch
								deaktiviert.
							</template>
						</openwb-base-button-group-input>
						<openwb-base-button-group-input
							title="Standard nach Abstecken"
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
							:model-value="template.load_default"
							@update:model-value="
								updateState(templateKey, $event, 'load_default')
							"
						>
							<template #help>
								Falls diese Option aktiviert ist, wird der
								betroffene Ladepunkt nach dem Abstecken auf das
								Standard Ladeprofil zurückgesetzt.
							</template>
						</openwb-base-button-group-input>
						<hr />
						<openwb-base-heading>Sofortladen</openwb-base-heading>
						<openwb-base-range-input
							title="Ladestrom"
							:min="6"
							:max="32"
							:step="1"
							unit="A"
							:model-value="
								template.chargemode.instant_charging.current
							"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'chargemode.instant_charging.current'
								)
							"
						>
						</openwb-base-range-input>
						<openwb-base-button-group-input
							title="Begrenzung"
							:buttons="[
								{
									buttonValue: 'none',
									text: 'Aus',
								},
								{
									buttonValue: 'soc',
									text: 'SoC',
								},
								{
									buttonValue: 'amount',
									text: 'Energie',
								},
							]"
							:model-value="
								template.chargemode.instant_charging.limit
									.selected
							"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'chargemode.instant_charging.limit.selected'
								)
							"
						>
							<template #help>
								Sofortladen kann entweder durch den Ladestand
								der Fahrzeugbatterie (SoC) oder eine
								Energiemenge in kWh begrenzt werden.
							</template>
						</openwb-base-button-group-input>
						<openwb-base-range-input
							title="SoC-Limit"
							:min="5"
							:max="100"
							:step="5"
							unit="%"
							:model-value="
								template.chargemode.instant_charging.limit.soc
							"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'chargemode.instant_charging.limit.soc'
								)
							"
						>
							<template #help>
								Um diese Begrenzung nutzen zu können, muss ein
								SoC-Modul für das jeweilige Fahrzeug
								eingerichtet werden!
							</template>
						</openwb-base-range-input>
						<openwb-base-number-input
							title="Energie-Limit"
							unit="Wh"
							:min="500"
							:step="500"
							:model-value="
								template.chargemode.instant_charging.limit
									.amount
							"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'chargemode.instant_charging.limit.amount'
								)
							"
						>
						</openwb-base-number-input>
						<hr />
						<openwb-base-heading>PV-laden</openwb-base-heading>
						<openwb-base-range-input
							title="Mindeststrom"
							:min="0"
							:max="11"
							:step="1"
							unit="A"
							:labels="[
								{ label: 'Aus', value: 0 },
								{ label: 6, value: 6 },
								{ label: 7, value: 7 },
								{ label: 8, value: 8 },
								{ label: 9, value: 9 },
								{ label: 10, value: 10 },
								{ label: 11, value: 11 },
								{ label: 12, value: 12 },
								{ label: 13, value: 13 },
								{ label: 14, value: 14 },
								{ label: 15, value: 15 },
								{ label: 16, value: 16 },
							]"
							:model-value="
								template.chargemode.pv_charging.min_current
							"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'chargemode.pv_charging.min_current'
								)
							"
						>
							<template #help>
								Hier kann ein Mindeststrom eingestellt werden,
								mit dem unabhängig vom vorhandenen Überschuss
								immer geladen wird. Diese Einstellung entspricht
								weitestgehend dem Lademodus "Min+PV" der Version
								1.x.
							</template>
						</openwb-base-range-input>
						<openwb-base-range-input
							title="SoC-Limit"
							:min="0"
							:max="20"
							:step="1"
							unit="%"
							:labels="[
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
								{ label: 100, value: 100 },
								{ label: 'Aus', value: 101 },
							]"
							:model-value="
								template.chargemode.pv_charging.max_soc
							"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'chargemode.pv_charging.max_soc'
								)
							"
						>
							<template #help>
								Bei der Einstellung "100%" wird die Ladung mit
								Erreichen der 100% ebenfalls beendet. Dadurch
								erfolgt kein Balancing der Batteriezellen. Ist
								dies gewünscht, muss hier "Aus" gewählt werden,
								um die Ladung nicht zu beenden.<br />
								Um diese Begrenzung nutzen zu können, muss ein
								SoC-Modul für das jeweilige Fahrzeug
								eingerichtet werden!
							</template>
						</openwb-base-range-input>
						<openwb-base-range-input
							title="Mindest-SoC"
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
								template.chargemode.pv_charging.min_soc
							"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'chargemode.pv_charging.min_soc'
								)
							"
						>
							<template #help>
								Liegt der Ladestand (SoC) der Fahrzeugbatterie
								unter dem hier eingestellten Wert, dann wird bis
								zum Erreichen dieses Wertes mit dem
								eingestellten "Mindest-SoC-Strom" geladen.<br />
								Um diese Begrenzung nutzen zu können, muss ein
								SoC-Modul für das jeweilige Fahrzeug
								eingerichtet werden!
							</template>
						</openwb-base-range-input>
						<openwb-base-range-input
							title="Mindest-SoC-Strom"
							:min="6"
							:max="32"
							:step="1"
							unit="A"
							:model-value="
								template.chargemode.pv_charging.min_soc_current
							"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'chargemode.pv_charging.min_soc_current'
								)
							"
						>
							<template #help>
								Wird der eingestellte Mindest-SoC
								unterschritten, dann wird unabhängig vom
								Überschuss ein Ladevorgang mit dem hier
								festgelegten Strom statt.
							</template>
						</openwb-base-range-input>
						<openwb-base-button-group-input
							title="Einspeisegrenze beachten"
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
							:model-value="
								template.chargemode.pv_charging.feed_in_limit
							"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'chargemode.pv_charging.feed_in_limit'
								)
							"
						/>
						<hr />
						<openwb-base-heading>
							Zielladen
							<template #actions>
								<openwb-base-avatar
									class="bg-success clickable"
									@click="
										addChargeTemplateSchedulePlan(
											templateKey,
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
								plan, planKey
							) in getChargeTemplateScheduledChargingPlans(
								templateKey
							)"
							:key="planKey"
							:title="plan.name"
							:collapsible="true"
							:collapsed="true"
						>
							<template #actions="slotProps">
								<span
									v-if="slotProps.collapsed == true"
									class="subheader pill"
									:class="
										plan.active ? 'bg-success' : 'bg-danger'
									"
								>
									<span v-if="plan.limit.selected == 'soc'">
										<font-awesome-icon
											fixed-width
											:icon="['fas', 'car-battery']"
										/>
										{{ plan.limit.soc }}%
									</span>
									<span
										v-if="plan.limit.selected == 'amount'"
									>
										<font-awesome-icon
											fixed-width
											:icon="['fas', 'car-battery']"
										/>
										{{ plan.limit.amount / 1000 }}kWh
									</span>
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'clock']"
									/>
									{{ plan.time }}
									<span
										v-if="plan.frequency.selected == 'once'"
									>
										<font-awesome-icon
											fixed-width
											:icon="['fas', 'calendar-day']"
										/>
										{{ formatDate(plan.frequency.once) }}
									</span>
									<span
										v-if="
											plan.frequency.selected == 'daily'
										"
									>
										<font-awesome-icon
											fixed-width
											:icon="['fas', 'calendar-week']"
										/>
									</span>
									<span
										v-if="
											plan.frequency.selected == 'weekly'
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
										removeChargeTemplateSchedulePlanModal(
											templateKey,
											planKey,
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
								:model-value="plan.name"
								@update:model-value="
									updateState(planKey, $event, 'name')
								"
							>
							</openwb-base-text-input>
							<openwb-base-button-group-input
								title="Zeitpunkt aktiv"
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
								:model-value="plan.active"
								@update:model-value="
									updateState(planKey, $event, 'active')
								"
							>
							</openwb-base-button-group-input>
							<openwb-base-text-input
								title="Uhrzeit"
								subtype="time"
								:model-value="plan.time"
								@update:model-value="
									updateState(planKey, $event, 'time')
								"
							>
							</openwb-base-text-input>
							<openwb-base-button-group-input
								title="Ziel"
								:buttons="[
									{ buttonValue: 'soc', text: 'SoC' },
									{
										buttonValue: 'amount',
										text: 'Energiemenge',
									},
								]"
								:model-value="plan.limit.selected"
								@update:model-value="
									updateState(
										planKey,
										$event,
										'limit.selected'
									)
								"
							>
								<template #help>Hilfetext</template>
							</openwb-base-button-group-input>
							<openwb-base-range-input
								title="Ziel-SoC"
								:min="5"
								:max="100"
								:step="5"
								unit="%"
								:model-value="plan.limit.soc"
								@update:model-value="
									updateState(planKey, $event, 'limit.soc')
								"
							>
							</openwb-base-range-input>
							<openwb-base-number-input
								title="Ziel-Energiemenge"
								unit="Wh"
								:min="1000"
								:step="500"
								:model-value="plan.limit.amount"
								@update:model-value="
									updateState(planKey, $event, 'limit.amount')
								"
							>
							</openwb-base-number-input>
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
								:model-value="plan.frequency.selected"
								@update:model-value="
									updateState(
										planKey,
										$event,
										'frequency.selected'
									)
								"
							>
							</openwb-base-button-group-input>
							<openwb-base-text-input
								v-if="plan.frequency.selected == 'once'"
								title="Datum"
								subtype="date"
								:model-value="plan.frequency.once"
								@update:model-value="
									updateState(
										planKey,
										$event,
										'frequency.once'
									)
								"
							>
							</openwb-base-text-input>
							<div v-if="plan.frequency.selected == 'weekly'">
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
										plan.frequency.weekly[dayIndex]
									"
									@update:model-value="
										updateState(
											planKey,
											$event,
											'frequency.weekly.' + dayIndex
										)
									"
								>
								</openwb-base-button-group-input>
							</div>
						</openwb-base-card>
						<hr />
						<openwb-base-heading>
							Laden nach Zeitplan
							<template #actions>
								<openwb-base-avatar
									class="bg-success clickable"
									@click="
										addChargeTemplateTimeChargingPlan(
											templateKey,
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
						<openwb-base-button-group-input
							title="Aktiviert"
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
							:model-value="template.time_charging.active"
							@update:model-value="
								updateState(
									templateKey,
									$event,
									'time_charging.active'
								)
							"
						>
						</openwb-base-button-group-input>
						<openwb-base-card
							v-for="(
								plan, planKey
							) in getChargeTemplateTimeChargingPlans(
								templateKey
							)"
							:key="planKey"
							:title="plan.name"
							:collapsible="true"
							:collapsed="true"
						>
							<template #actions="slotProps">
								<span
									v-if="slotProps.collapsed == true"
									class="subheader pill"
									:class="
										plan.active ? 'bg-success' : 'bg-danger'
									"
								>
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'clock']"
									/>
									{{ plan.time[0] }} - {{ plan.time[1] }}
									<span
										v-if="plan.frequency.selected == 'once'"
									>
										<font-awesome-icon
											fixed-width
											:icon="['fas', 'calendar-day']"
										/>
										{{
											formatDate(
												plan.frequency.once[0]
											) ==
											formatDate(plan.frequency.once[1])
												? formatDate(
														plan.frequency.once[0]
												  )
												: formatDate(
														plan.frequency.once[0]
												  ) +
												  " - " +
												  formatDate(
														plan.frequency.once[1]
												  )
										}}
									</span>
									<span
										v-if="
											plan.frequency.selected == 'daily'
										"
									>
										<font-awesome-icon
											fixed-width
											:icon="['fas', 'calendar-week']"
										/>
									</span>
									<span
										v-if="
											plan.frequency.selected == 'weekly'
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
										removeChargeTemplateTimeChargingPlanModal(
											templateKey,
											planKey,
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
								:model-value="plan.name"
								@update:model-value="
									updateState(planKey, $event, 'name')
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
								:model-value="plan.active"
								@update:model-value="
									updateState(planKey, $event, 'active')
								"
							>
							</openwb-base-button-group-input>
							<openwb-base-range-input
								title="Ladestrom"
								:min="6"
								:max="32"
								:step="1"
								unit="A"
								:model-value="plan.current"
								@update:model-value="
									updateState(planKey, $event, 'current')
								"
							>
							</openwb-base-range-input>
							<openwb-base-text-input
								title="Beginn"
								subtype="time"
								:model-value="plan.time[0]"
								@update:model-value="
									updateState(planKey, $event, 'time.0')
								"
							>
							</openwb-base-text-input>
							<openwb-base-text-input
								title="Ende"
								subtype="time"
								:model-value="plan.time[1]"
								@update:model-value="
									updateState(planKey, $event, 'time.1')
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
								:model-value="plan.frequency.selected"
								@update:model-value="
									updateState(
										planKey,
										$event,
										'frequency.selected'
									)
								"
							>
							</openwb-base-button-group-input>
							<openwb-base-text-input
								v-if="plan.frequency.selected == 'once'"
								title="Gültig ab"
								subtype="date"
								:model-value="plan.frequency.once[0]"
								@update:model-value="
									updateState(
										planKey,
										$event,
										'frequency.once.0'
									)
								"
							/>
							<openwb-base-text-input
								v-if="plan.frequency.selected == 'once'"
								title="Gültig bis"
								subtype="date"
								:min="plan.frequency.once[0]"
								:model-value="plan.frequency.once[1]"
								@update:model-value="
									updateState(
										planKey,
										$event,
										'frequency.once.1'
									)
								"
							/>
							<div v-if="plan.frequency.selected == 'weekly'">
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
										plan.frequency.weekly[dayIndex]
									"
									@update:model-value="
										updateState(
											planKey,
											$event,
											'frequency.weekly.' + dayIndex
										)
									"
								>
								</openwb-base-button-group-input>
							</div>
						</openwb-base-card>
					</openwb-base-card>
				</div>
			</openwb-base-card>
			<openwb-base-submit-buttons
				formName="vehicleConfigForm"
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
	faClock as fasClock,
	faCarBattery as fasCarBattery,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	fasPlus,
	fasTrash,
	fasCalendarDay,
	fasCalendarAlt,
	fasCalendarWeek,
	fasClock,
	fasCarBattery
);

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";
import OpenwbConfigProxy from "@/components/OpenwbConfigProxy.vue";

export default {
	name: "OpenwbVehicleConfig",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		FontAwesomeIcon,
		OpenwbConfigProxy,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/vehicle/template/ev_template/+",
				"openWB/vehicle/template/charge_template/+",
				"openWB/vehicle/template/charge_template/+/chargemode/scheduled_charging/plans/+",
				"openWB/vehicle/template/charge_template/+/time_charging/plans/+",
				"openWB/vehicle/+/name",
				"openWB/vehicle/+/charge_template",
				"openWB/vehicle/+/ev_template",
				"openWB/vehicle/+/tag_id",
				"openWB/system/configurable/soc_modules",
				"openWB/vehicle/+/soc_module/config",
			],
			showVehicleModal: false,
			modalVehicleIndex: undefined,
			showEvTemplateModal: false,
			modalEvTemplateIndex: undefined,
			showChargeTemplateModal: false,
			modalChargeTemplateIndex: undefined,
			showChargeTemplateSchedulePlanModal: false,
			modalChargeTemplateSchedulePlanIndex: undefined,
			showChargeTemplateTimeChargingPlanModal: false,
			modalChargeTemplateTimeChargingPlanIndex: undefined,
		};
	},
	computed: {
		vehicleIndexes: {
			get() {
				return this.getWildcardIndexList("openWB/vehicle/+/name");
			},
		},
		evTemplates: {
			get() {
				return this.getWildcardTopics(
					"openWB/vehicle/template/ev_template/+"
				);
			},
		},
		evTemplateList: {
			get() {
				let myList = [];
				Object.keys(this.evTemplates).forEach((key) => {
					let index = parseInt(key.match(/([0-9]+)$/g)[0]);
					let name =
						this.$store.state.mqtt[
							"openWB/vehicle/template/ev_template/" + index
						].name;
					myList.push({ value: index, text: name });
				});
				return myList;
			},
		},
		chargeTemplates: {
			get() {
				return this.getWildcardTopics(
					"openWB/vehicle/template/charge_template/+"
				);
			},
		},
		chargeTemplateList: {
			get() {
				let myList = [];
				Object.keys(this.chargeTemplates).forEach((key) => {
					let index = parseInt(key.match(/([0-9]+)$/g)[0]);
					let name =
						this.$store.state.mqtt[
							"openWB/vehicle/template/charge_template/" + index
						].name;
					myList.push({ value: index, text: name });
				});
				return myList;
			},
		},
		socModuleList: {
			get() {
				return this.$store.state.mqtt[
					"openWB/system/configurable/soc_modules"
				];
			},
		},
	},
	methods: {
		getChargeTemplateScheduledChargingPlans(chargeTemplate) {
			// get trailing characters as index
			let index = chargeTemplate.match(/([^/]+)$/)[0];
			let result = this.getWildcardTopics(
				"openWB/vehicle/template/charge_template/" +
					index +
					"/chargemode/scheduled_charging/plans/+"
			);
			return result;
		},
		getChargeTemplateTimeChargingPlans(chargeTemplate) {
			// get trailing characters as index
			let index = chargeTemplate.match(/([^/]+)$/)[0];
			let result = this.getWildcardTopics(
				"openWB/vehicle/template/charge_template/" +
					index +
					"/time_charging/plans/+"
			);
			return result;
		},
		addVehicle(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("requesting new vehicle...");
			this.$emit("sendCommand", {
				command: "addVehicle",
				data: {},
			});
		},
		removeVehicleModal(vehicleIndex, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.modalVehicleIndex = vehicleIndex;
			this.showVehicleModal = true;
		},
		removeVehicle(vehicleIndex, event) {
			this.showVehicleModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of vehicle '" + vehicleIndex + "'"
				);
				this.$emit("sendCommand", {
					command: "removeVehicle",
					data: { id: vehicleIndex },
				});
			}
		},
		getVehicleName(id) {
			return this.$store.state.mqtt["openWB/vehicle/" + id + "/name"]
				? this.$store.state.mqtt["openWB/vehicle/" + id + "/name"]
				: "Fahrzeug " + id;
		},
		getSocDefaultConfiguration(socType) {
			const socDefaults = this.socModuleList.find(
				(element) => element.value == socType
			);
			if (Object.prototype.hasOwnProperty.call(socDefaults, "defaults")) {
				return { ...socDefaults.defaults.configuration };
			}
			console.warn(
				"no default configuration found for soc type!",
				socType
			);
			return {};
		},
		updateSelectedSocModule(vehicleId, $event) {
			this.updateState(
				"openWB/vehicle/" + vehicleId + "/soc_module/config",
				$event,
				"type"
			);
			this.updateState(
				"openWB/vehicle/" + vehicleId + "/soc_module/config",
				this.getSocDefaultConfiguration($event),
				"configuration"
			);
		},
		updateConfiguration(key, event) {
			console.debug("updateConfiguration", key, event);
			this.updateState(key, event.value, event.object);
		},
		addEvTemplate(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("requesting new ev template...");
			this.$emit("sendCommand", {
				command: "addEvTemplate",
				data: {},
			});
		},
		removeEvTemplateModal(evTemplate, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			// get trailing characters as index
			this.modalEvTemplateIndex = parseInt(
				evTemplate.match(/([^/]+)$/)[0]
			);
			this.showEvTemplateModal = true;
		},
		removeEvTemplate(evTemplateIndex, event) {
			this.showEvTemplateModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of ev template '" + evTemplateIndex + "'"
				);
				this.$emit("sendCommand", {
					command: "removeEvTemplate",
					data: { id: evTemplateIndex },
				});
			}
		},
		getEvTemplateName(id) {
			return this.$store.state.mqtt[
				"openWB/vehicle/template/ev_template/" + id
			]
				? this.$store.state.mqtt[
						"openWB/vehicle/template/ev_template/" + id
				  ].name
				: "Fahrzeug-Vorlage " + id;
		},
		addChargeTemplate(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("requesting new charge template...");
			this.$emit("sendCommand", {
				command: "addChargeTemplate",
				data: {},
			});
		},
		removeChargeTemplateModal(chargeTemplate, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			// get trailing characters as index
			this.modalChargeTemplateIndex = parseInt(
				chargeTemplate.match(/([^/]+)$/)[0]
			);
			this.showChargeTemplateModal = true;
		},
		removeChargeTemplate(chargeTemplateIndex, event) {
			this.showChargeTemplateModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of charge template '" +
						chargeTemplateIndex +
						"'"
				);
				this.$emit("sendCommand", {
					command: "removeChargeTemplate",
					data: { id: chargeTemplateIndex },
				});
			}
		},
		getChargeTemplateName(id) {
			return this.$store.state.mqtt[
				"openWB/vehicle/template/charge_template/" + id
			]
				? this.$store.state.mqtt[
						"openWB/vehicle/template/charge_template/" + id
				  ].name
				: "Ladeprofil-Vorlage " + id;
		},
		getChargeTemplateSchedulePlanName(templateIndex, planIndex) {
			return this.$store.state.mqtt[
				"openWB/vehicle/template/charge_template/" +
					templateIndex +
					"/chargemode/scheduled_charging/plans/" +
					planIndex
			]
				? this.$store.state.mqtt[
						"openWB/vehicle/template/charge_template/" +
							templateIndex +
							"/chargemode/scheduled_charging/plans/" +
							planIndex
				  ].name
				: "Zielladen Zeitplan " + templateIndex + "/" + planIndex;
		},
		addChargeTemplateSchedulePlan(template, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("requesting new charge template schedule plan...");
			// get trailing characters as index
			let templateIndex = parseInt(template.match(/([^/]+)$/)[0]);
			this.$emit("sendCommand", {
				command: "addChargeTemplateSchedulePlan",
				data: { template: templateIndex },
			});
		},
		removeChargeTemplateSchedulePlanModal(chargeTemplate, plan, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			// get trailing characters as index
			this.modalChargeTemplateIndex = parseInt(
				chargeTemplate.match(/([^/]+)$/)[0]
			);
			this.modalChargeTemplateSchedulePlanIndex = parseInt(
				plan.match(/([^/]+)$/)[0]
			);
			this.showChargeTemplateSchedulePlanModal = true;
		},
		removeChargeTemplateSchedulePlan(templateIndex, planIndex, event) {
			this.showChargeTemplateSchedulePlanModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of charge template '" +
						templateIndex +
						"' schedule plan '" +
						planIndex +
						"'"
				);
				this.$emit("sendCommand", {
					command: "removeChargeTemplateSchedulePlan",
					data: { template: templateIndex, plan: planIndex },
				});
			}
		},
		getChargeTemplateTimeChargingPlanName(templateIndex, planIndex) {
			return this.$store.state.mqtt[
				"openWB/vehicle/template/charge_template/" +
					templateIndex +
					"/time_charging/plans/" +
					planIndex
			]
				? this.$store.state.mqtt[
						"openWB/vehicle/template/charge_template/" +
							templateIndex +
							"/time_charging/plans/" +
							planIndex
				  ].name
				: "Zeitladen Zeitplan " + templateIndex + "/" + planIndex;
		},
		addChargeTemplateTimeChargingPlan(template, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info(
				"requesting new charge template time charging plan..."
			);
			// get trailing characters as index
			let templateIndex = parseInt(template.match(/([^/]+)$/)[0]);
			this.$emit("sendCommand", {
				command: "addChargeTemplateTimeChargingPlan",
				data: { template: templateIndex },
			});
		},
		removeChargeTemplateTimeChargingPlanModal(chargeTemplate, plan, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			// get trailing characters as index
			this.modalChargeTemplateIndex = parseInt(
				chargeTemplate.match(/([^/]+)$/)[0]
			);
			this.modalChargeTemplateTimeChargingPlanIndex = parseInt(
				plan.match(/([^/]+)$/)[0]
			);
			this.showChargeTemplateTimeChargingPlanModal = true;
		},
		removeChargeTemplateTimeChargingPlan(templateIndex, planIndex, event) {
			this.showChargeTemplateTimeChargingPlanModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of charge template '" +
						templateIndex +
						"' time charging plan '" +
						planIndex +
						"'"
				);
				this.$emit("sendCommand", {
					command: "removeChargeTemplateTimeChargingPlan",
					data: { template: templateIndex, plan: planIndex },
				});
			}
		},
	},
};
</script>

<style scoped>
.clickable {
	cursor: pointer;
}
</style>
